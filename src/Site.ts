import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { defaultLocale } from "./getLocale";

export default abstract class Site {
  /** 変更を監視しているオブジェクト */
  observers: MutationObserver[] = [];

  /** 生成されたらdayjsの地域設定してコンソールに起動したログを残します。 */
  constructor() {
    dayjs.extend(localizedFormat);
    // dayjsのグローバル地域設定.
    dayjs.locale(defaultLocale);
    // eslint-disable-next-line no-console
    console.log(`goodbye-rfc-2822-date-time: ${dayjs().format("LLLL")}`);
  }

  /** 初期化と書き換えの実行。 */
  init(): void {
    this.initListener();
    this.run();
  }

  /** 全てのページで行う初期監視。 */
  private initListener(): void {
    // AutoPagerizeでページが読み込まれた場合に対応
    document.body.addEventListener(
      "AutoPagerize_DOMNodeInserted",
      () => this.run,
    );
    // 履歴書き換える系のSPAに効果があるかもしれない(未確認)
    window.addEventListener("popstate", () => this.run);
  }

  /** ページに変更が入ったら呼び出されます。 */
  run = (): void => {
    // 監視を中断します。
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    // 全画面の書き換えを行います。
    this.replace();
    // 監視を再開します。
    this.observe();
  };

  /** 実際の画面の書き換えを行います。 */
  abstract replace(): void;

  /** サイトの監視を開始します。 */
  abstract observe(): void;
}
