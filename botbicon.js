class BotbIcon {
  constructor() {}

  /*
   * returns all css rules in the botb stylesheet for given search query
   * searches all selector names using string.includes
   * when nothing found (or on error) returns empty object
   */
  getStyle(searchQuery) {
    let botbStylesheet = null;

    for (let stylesheet of document.styleSheets) {
      if (stylesheet.title == "botb") {
        botbStylesheet = stylesheet;
      }
    }

    if (!botbStylesheet) {
      console.error("botb icons stylesheet could not be loaded");
      return {};
    }

    let cssText = "";
    let classes = botbStylesheet.rules || botbStylesheet.cssRules;

    for (var x = 0; x < classes.length; x++) {
      if (classes[x].selectorText.includes(searchQuery)) {
        return classes[x].style;
      }
    }
    return {};
  }

  /*
   * searches botb css for matching icon name, then returns an object with
   * width, height, x and y positions in the spritesheet
   */
  getIcon(name) {
    let style = this.getStyle(name);
    return {
      width: Math.abs(parseInt(style.width)),
      height: Math.abs(parseInt(style.height)),
      posX: Math.abs(parseInt(style.backgroundPositionX)),
      posY: Math.abs(parseInt(style.backgroundPositionY))
    };
  }

  random16icon() {
    let botbStylesheet = null;

    for (let stylesheet of document.styleSheets) {
      if (stylesheet.title == "botb") {
        botbStylesheet = stylesheet;
      }
    }

    if (!botbStylesheet) {
      console.error("botb icons stylesheet could not be loaded");
      return {};
    }

    let cssText = "";
    let classes = botbStylesheet.rules || botbStylesheet.cssRules;

    /* scary infinite loop, but we should eventually land on a random
       icon that is 16x16 */
    while (true) {
      let random = Math.floor(Math.random() * classes.length);

      if (
        classes[random].style.width === "16px" &&
        classes[random].style.height === "16px"
      ) {
        let style = classes[random].style;
        let names = classes[random].selectorText.split("-");
        return {
          width: Math.abs(parseInt(style.width)),
          height: Math.abs(parseInt(style.height)),
          posX: Math.abs(parseInt(style.backgroundPositionX)),
          posY: Math.abs(parseInt(style.backgroundPositionY)),
          name: names[names.length - 1]
        };
      }
    }
  }
}

var botbIcon = new BotbIcon();
