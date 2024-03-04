import type { Page, TestInfo } from "@playwright/test";
import { matchScreenshot, takeScreenshot } from "@utils/base/web/screenshots";
import * as actions from "@utils/base/web/actions";
import { appConfigPath } from "@config";

export default class CommonPage {
  constructor(public page: Page, public workerInfo: TestInfo) {
    const config = require(appConfigPath);
  }

  async verifySnapshot(name: string) {
    !config.default.use.headless &&
      (await matchScreenshot(this.page, name, this.workerInfo));
  }

  async waitForAnimationEnd(locator: string) {
    await actions.waitForAnimationEnd(this.page, locator);
  }

  async waitForNetworkIdle() {
    await actions.waitForNetworkIdle(this.page);
  }

  async waitForDocumentLoad() {
    await actions.waitForDocumentLoad(this.page);
  }

  async deBounceDOM() {
    await actions.deBounceDOM(this.page);
  }

  async verifyElementDoesNotExists(locator: string) {
    await actions.verifyElementDoesNotExists(this.page, locator, this.workerInfo);
  }

  async captureScreenshot(name: string) {
    await takeScreenshot(
      this.page, 
      name, 
      true, 
      this.workerInfo
      )
  }
  
}
