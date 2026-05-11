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
    @Environment(\.widgetFamily) private var family

    private let compactAmounts = [1000, 5000, 10000]
    private let fullAmounts = [1000, 5000, 10000, 50000]

    var body: some View {
        switch family {
        case .systemSmall:
            compactView
        case .systemMedium:
            mediumView
        default:
            largeView
        }
    }

    private var compactView: some View {
        VStack(alignment: .leading, spacing: 7) {
            header
            Text("1 JPY")
                .font(.caption2)
                .foregroundStyle(.secondary)
            Text("\(entry.snapshot.rate.rateText) TWD")
                .font(.system(size: 20, weight: .bold, design: .rounded))
                .lineLimit(1)
                .minimumScaleFactor(0.72)
            Divider()
            amountRow(10000)
            Spacer(minLength: 0)
            openAppHint
        }
        .padding(2)
        .widgetBackground
        .widgetURL(URL(string: "jpytwdconverter://open"))
    }

    private var mediumView: some View {
        VStack(alignment: .leading, spacing: 10) {
            header
            HStack(alignment: .firstTextBaseline) {
                VStack(alignment: .leading, spacing: 3) {
                    Text("1 JPY")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    Text("\(entry.snapshot.rate.rateText) TWD")
                        .font(.system(size: 24, weight: .bold, design: .rounded))
                        .lineLimit(1)
                        .minimumScaleFactor(0.78)
                }
                Spacer()
                openAppPill
            }
            Divider()
            VStack(spacing: 6) {
                ForEach(compactAmounts, id: \.self) { amount in
                    amountRow(amount)
                }
            }
        }
        .padding(2)
        .widgetBackground
        .widgetURL(URL(string: "jpytwdconverter://open"))
    }

    private var largeView: some View {
        VStack(alignment: .leading, spacing: 12) {
            header
            VStack(alignment: .leading, spacing: 4) {
                Text("目前匯率")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                Text("1 JPY = \(entry.snapshot.rate.rateText) TWD")
                    .font(.system(size: 28, weight: .bold, design: .rounded))
                    .lineLimit(1)
                    .minimumScaleFactor(0.78)
            }
            Divider()
            Text("常用換算")
                .font(.caption.weight(.semibold))
                .foregroundStyle(.secondary)
            VStack(spacing: 8) {
                ForEach(fullAmounts, id: \.self) { amount in
                    amountRow(amount)
                }
            }
            Spacer(minLength: 0)
            HStack {
                Image(systemName: "keyboard")
                Text("點一下小工具，開啟 App 輸入自訂金額")
                    .lineLimit(1)
                    .minimumScaleFactor(0.75)
            }
            .font(.caption.weight(.semibold))
            .foregroundStyle(.brown)
            .padding(.vertical, 8)
            .padding(.horizontal, 12)
            .background(.brown.opacity(0.10), in: Capsule())
        }
        .padding(2)
        .widgetBackground
        .widgetURL(URL(string: "jpytwdconverter://open"))
    }

    private var header: some View {
        HStack(spacing: 6) {
            Image(systemName: "yensign.circle.fill")
                .foregroundStyle(.brown)
            Text("日幣匯率")
                .font(.caption.weight(.bold))
                .foregroundStyle(.secondary)
            Spacer(minLength: 0)
        }
    }

    private func amountRow(_ amount: Int) -> some View {
        HStack {
            Text("¥\(amount.formatted())")
                .foregroundStyle(.primary)
            Spacer()
            Text((Double(amount) * entry.snapshot.rate).twdCurrencyText)
                .fontWeight(.bold)
                .monospacedDigit()
        }
        .font(.callout)
    }

    private var openAppHint: some View {
        Text("點一下輸入")
            .font(.caption2.weight(.semibold))
            .foregroundStyle(.brown)
            .lineLimit(1)
    }

    private var openAppPill: some View {
        HStack(spacing: 5) {
            Image(systemName: "keyboard")
            Text("輸入")
        }
        .font(.caption.weight(.semibold))
        .foregroundStyle(.brown)
        .padding(.vertical, 7)
        .padding(.horizontal, 11)
        .background(.brown.opacity(0.10), in: Capsule())
    }
}

private extension View {
    var widgetBackground: some View {
        containerBackground(for: .widget) {
            LinearGradient(
                colors: [Color(red: 0.97, green: 0.93, blue: 0.87), .white],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        }
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
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

@main
struct JPYTWDWidgetBundle: WidgetBundle {
    var body: some Widget {
        JPYTWDRateWidget()
    }
}

#Preview(as: .systemMedium) {
    JPYTWDRateWidget()
} timeline: {
    RateEntry(date: Date(), snapshot: .fallback)
}
