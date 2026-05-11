import WidgetKit
import SwiftUI

struct RateEntry: TimelineEntry {
    let date: Date
    let snapshot: ExchangeRateSnapshot
}

struct RateProvider: TimelineProvider {
    func placeholder(in context: Context) -> RateEntry {
        RateEntry(date: Date(), snapshot: .fallback)
    }

    func getSnapshot(in context: Context, completion: @escaping (RateEntry) -> Void) {
        Task {
            let snapshot = await ExchangeRateService.shared.loadCachedRate()
            completion(RateEntry(date: Date(), snapshot: snapshot))
        }
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<RateEntry>) -> Void) {
        Task {
            let snapshot: ExchangeRateSnapshot
            do {
                snapshot = try await ExchangeRateService.shared.fetchLatestRate()
            } catch {
                snapshot = await ExchangeRateService.shared.loadCachedRate()
            }

            let entry = RateEntry(date: Date(), snapshot: snapshot)
            let nextUpdate = Calendar.current.date(byAdding: .minute, value: 60, to: Date()) ?? Date().addingTimeInterval(3600)
            completion(Timeline(entries: [entry], policy: .after(nextUpdate)))
        }
    }
}

struct JPYTWDRateWidgetView: View {
    let entry: RateEntry

    private let commonAmounts = [1000, 5000, 10000]

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("日幣匯率")
                    .font(.caption.weight(.bold))
                    .foregroundStyle(.secondary)
                Spacer()
                Image(systemName: "yensign.circle.fill")
                    .foregroundStyle(.brown)
            }

            Text("1 JPY")
                .font(.caption)
                .foregroundStyle(.secondary)
            Text("\(entry.snapshot.rate.rateText) TWD")
                .font(.system(size: 22, weight: .bold, design: .rounded))
                .lineLimit(1)
                .minimumScaleFactor(0.75)

            Divider()

            ForEach(commonAmounts, id: \.self) { amount in
                HStack {
                    Text("¥\(amount.formatted())")
                    Spacer()
                    Text((Double(amount) * entry.snapshot.rate).twdCurrencyText)
                        .fontWeight(.semibold)
                }
                .font(.caption)
            }

            Spacer(minLength: 0)

            Text("點一下開啟換算")
                .font(.caption2)
                .foregroundStyle(.secondary)
        }
        .containerBackground(for: .widget) {
            LinearGradient(
                colors: [Color(red: 0.97, green: 0.93, blue: 0.87), .white],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        }
        .widgetURL(URL(string: "jpytwdconverter://open"))
    }
}

struct JPYTWDRateWidget: Widget {
    let kind: String = "JPYTWDRateWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: RateProvider()) { entry in
            JPYTWDRateWidgetView(entry: entry)
        }
        .configurationDisplayName("日幣匯率")
        .description("顯示 JPY → TWD 匯率與常用金額換算。")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

@main
struct JPYTWDWidgetBundle: WidgetBundle {
    var body: some Widget {
        JPYTWDRateWidget()
    }
}

#Preview(as: .systemSmall) {
    JPYTWDRateWidget()
} timeline: {
    RateEntry(date: Date(), snapshot: .fallback)
}
