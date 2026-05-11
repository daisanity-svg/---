import SwiftUI
import WidgetKit

struct ConverterView: View {
    @State private var jpyText: String = "10000"
    @State private var twdText: String = ""
    @State private var snapshot: ExchangeRateSnapshot = .fallback
    @State private var isLoading = false
    @FocusState private var focusedField: Field?

    private enum Field {
        case jpy
        case twd
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    header
                    converterCard
                    quickButtons
                    rateFooter
                }
                .padding(20)
            }
            .scrollDismissesKeyboard(.interactively)
            .background(
                LinearGradient(
                    colors: [Color(red: 0.97, green: 0.93, blue: 0.87), .white],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()
            )
            .contentShape(Rectangle())
            .onTapGesture {
                hideKeyboard()
            }
            .navigationTitle("日幣換算")
            .toolbar {
                ToolbarItemGroup(placement: .keyboard) {
                    Spacer()
                    Button("完成") {
                        hideKeyboard()
                    }
                    .fontWeight(.semibold)
                }
            }
            .task {
                await refreshRate()
            }
        }
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("JPY → TWD Converter")
                .font(.caption.weight(.bold))
                .foregroundStyle(.brown)
                .tracking(2)
            Text("日幣換算台幣")
                .font(.system(size: 38, weight: .bold, design: .rounded))
            Text("輸入日幣金額，依查詢當下的即時匯率換算台幣。")
                .foregroundStyle(.secondary)
        }
    }

    private var converterCard: some View {
        VStack(spacing: 16) {
            VStack(alignment: .leading, spacing: 8) {
                Text("日幣金額 JPY")
                    .font(.caption.weight(.bold))
                    .foregroundStyle(.secondary)
                TextField("輸入日幣", text: $jpyText)
                    .keyboardType(.decimalPad)
                    .font(.system(size: 34, weight: .bold, design: .rounded))
                    .focused($focusedField, equals: .jpy)
                    .onTapGesture { focusedField = .jpy }
                    .onChange(of: jpyText) { _, _ in convertFromJPY() }
            }

            VStack(alignment: .leading, spacing: 8) {
                Text("換算台幣 TWD")
                    .font(.caption.weight(.bold))
                    .foregroundStyle(.secondary)
                TextField("換算結果", text: $twdText)
                    .keyboardType(.decimalPad)
                    .font(.system(size: 34, weight: .bold, design: .rounded))
                    .focused($focusedField, equals: .twd)
                    .onTapGesture { focusedField = .twd }
                    .onChange(of: twdText) { _, _ in convertFromTWD() }
            }

            Button {
                clearAmounts()
            } label: {
                Label("清除金額", systemImage: "xmark.circle.fill")
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .tint(.brown)
        }
        .padding(20)
        .background(.white.opacity(0.78), in: RoundedRectangle(cornerRadius: 26, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 26, style: .continuous)
                .stroke(.brown.opacity(0.15))
        )
    }

    private var quickButtons: some View {
        LazyVGrid(columns: [GridItem(.adaptive(minimum: 110))], spacing: 10) {
            ForEach([1000, 5000, 10000, 50000, 100000], id: \.self) { amount in
                Button("¥\(amount.formatted())") {
                    focusedField = .jpy
                    jpyText = String(amount)
                    convertFromJPY()
                    hideKeyboard()
                }
                .buttonStyle(.bordered)
                .tint(.brown)
            }
        }
    }

    private var rateFooter: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 6) {
                    Text("目前匯率")
                        .font(.caption.weight(.bold))
                        .foregroundStyle(.secondary)
                    Text("1 JPY = \(snapshot.rate.rateText) TWD")
                        .font(.title3.weight(.bold))
                }
                Spacer()
                Button(isLoading ? "更新中" : "更新匯率") {
                    hideKeyboard()
                    Task { await refreshRate() }
                }
                .buttonStyle(.borderedProminent)
                .tint(.brown)
                .disabled(isLoading)
            }

            Text("已更新：\(snapshot.dateText)｜來源：\(snapshot.source)｜實際成交仍需依銀行買賣匯率為準。")
                .font(.footnote)
                .foregroundStyle(.secondary)
        }
        .padding(18)
        .background(.white.opacity(0.56), in: RoundedRectangle(cornerRadius: 22, style: .continuous))
    }

    private func refreshRate() async {
        isLoading = true
        defer { isLoading = false }

        do {
            snapshot = try await ExchangeRateService.shared.fetchLatestRate()
            WidgetCenter.shared.reloadAllTimelines()
        } catch {
            snapshot = await ExchangeRateService.shared.loadCachedRate()
        }
        convertFromJPY()
    }

    private func clearAmounts() {
        jpyText = ""
        twdText = ""
        focusedField = .jpy
    }

    private func hideKeyboard() {
        focusedField = nil
    }

    private func convertFromJPY() {
        guard focusedField != .twd else { return }
        let jpy = Double(jpyText) ?? 0
        twdText = jpy > 0 ? String(format: "%.2f", jpy * snapshot.rate) : ""
    }

    private func convertFromTWD() {
        guard focusedField == .twd else { return }
        let twd = Double(twdText) ?? 0
        jpyText = twd > 0 ? String(format: "%.2f", twd / snapshot.rate) : ""
    }
}

#Preview {
    ConverterView()
}
