import Foundation

struct ExchangeRateSnapshot: Codable, Equatable {
    let rate: Double
    let source: String
    let dateText: String
    let updatedAt: Date

    static let fallback = ExchangeRateSnapshot(
        rate: 0.20004,
        source: "Fallback",
        dateText: "尚未更新",
        updatedAt: Date()
    )
}

enum ExchangeRateError: Error {
    case invalidResponse
    case missingRate
}

actor ExchangeRateService {
    static let shared = ExchangeRateService()

    private let appGroupDefaults = UserDefaults(suiteName: "group.com.daisanity.jpytwdconverter")
    private let cacheKey = "latestExchangeRateSnapshot"

    func loadCachedRate() -> ExchangeRateSnapshot {
        guard
            let data = appGroupDefaults?.data(forKey: cacheKey),
            let snapshot = try? JSONDecoder().decode(ExchangeRateSnapshot.self, from: data)
        else {
            return .fallback
        }
        return snapshot
    }

    func saveCachedRate(_ snapshot: ExchangeRateSnapshot) {
        guard let data = try? JSONEncoder().encode(snapshot) else { return }
        appGroupDefaults?.set(data, forKey: cacheKey)
    }

    func fetchLatestRate() async throws -> ExchangeRateSnapshot {
        do {
            let snapshot = try await fetchFromFrankfurter()
            saveCachedRate(snapshot)
            return snapshot
        } catch {
            let snapshot = try await fetchFromCurrencyCDN()
            saveCachedRate(snapshot)
            return snapshot
        }
    }

    private func fetchFromFrankfurter() async throws -> ExchangeRateSnapshot {
        let url = URL(string: "https://api.frankfurter.app/latest?from=JPY&to=TWD")!
        let (data, response) = try await URLSession.shared.data(from: url)
        guard (response as? HTTPURLResponse)?.statusCode == 200 else {
            throw ExchangeRateError.invalidResponse
        }

        struct Response: Decodable {
            let date: String
            let rates: [String: Double]
        }

        let decoded = try JSONDecoder().decode(Response.self, from: data)
        guard let rate = decoded.rates["TWD"], rate > 0 else {
            throw ExchangeRateError.missingRate
        }

        return ExchangeRateSnapshot(
            rate: rate,
            source: "Frankfurter",
            dateText: decoded.date,
            updatedAt: Date()
        )
    }

    private func fetchFromCurrencyCDN() async throws -> ExchangeRateSnapshot {
        let url = URL(string: "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/jpy.json")!
        let (data, response) = try await URLSession.shared.data(from: url)
        guard (response as? HTTPURLResponse)?.statusCode == 200 else {
            throw ExchangeRateError.invalidResponse
        }

        struct Response: Decodable {
            let date: String
            let jpy: [String: Double]
        }

        let decoded = try JSONDecoder().decode(Response.self, from: data)
        guard let rate = decoded.jpy["twd"], rate > 0 else {
            throw ExchangeRateError.missingRate
        }

        return ExchangeRateSnapshot(
            rate: rate,
            source: "Currency API CDN",
            dateText: decoded.date,
            updatedAt: Date()
        )
    }
}

extension Double {
    var twdCurrencyText: String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "TWD"
        formatter.currencySymbol = "NT$"
        formatter.maximumFractionDigits = 0
        return formatter.string(from: NSNumber(value: self)) ?? "NT$0"
    }

    var rateText: String {
        String(format: "%.6f", self)
    }
}
