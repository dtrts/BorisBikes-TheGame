class DragDrop {
  constructor(game) {
    this.game = game
    this.canvasOffset = this.game.canvas.getBoundingClientRect();
    this.selection;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.mouse = {
      x: 0,
      y: 0
    };
    this.init();
  }

  init() {
    window.addEventListener("resize", (event) => {
      this.canvasOffset = this.game.canvas.getBoundingClientRect();

    });
    this.game.canvas.addEventListener('mousemove', (event) => {
      this.updateMousePos(event);
      if (this.selection) {
        this.selection.x = this.mouse.x - this.dragOffsetX;
        this.selection.y = this.mouse.y - this.dragOffsetY;
        let selectionLocation = {
          x: this.selection.x,
          y: this.selection.y
        }
        // redraw the background with the dragged object ontop
        this.reDrawEverything()
        let dockingStationCopy = new Rect("Docking-Station", selectionLocation.x, selectionLocation.y, 23.3, 23.3, "blue", contextBG);
        dockingStationCopy.draw()
        // drawHelpers.dockingStationCopy(canvasBG, this.game.world.map, selectionLocation)
      }
    }, true);

    this.game.canvas.addEventListener('mouseup', (event) => {
      this.game.drawDsPlacement = false

      if (this.isOccupied(this.mouse, this.ds)) return;
      if (this.mouse.y > 650) return;

      let tile = this.findTile();

      this.selection.y = tile.y;
      this.selection.x = tile.x;

      let dsX = this.mouse.x / canvas.width
      let dsY = this.mouse.y / canvas.height
      let loc = new Location(dsX, dsY)

      let gridLoc = this.game.world.map.gridLocFromLoc(loc)
      let centerOfGridDS = this.game.world.map.centerOfGrid(gridLoc)
      this.game.world.generateDockingStation({
        location: centerOfGridDS
      }, true, true, true)


      this.reDrawEverything();
      this.selection.isActive = true;
      this.selection = null;
    }, true);

    this.game.canvas.addEventListener('mousedown', (event) => {
      if (this.game.dragDrop.selection) return;
      if (!(this.mouse.y >= 650 && this.mouse.y <= 700)) return; // not in toolbar!

      let dockingStationButton;

      if (this.mouse.x >= 150 && this.mouse.x < 170 && this.game.world.balance < 70) {
        alert("Insufficient funds")

      } else if (this.mouse.x >= 150 && this.mouse.x < 170) {
        this.game.drawDsPlacement = true

        dockingStationButton = new Rect("Docking-Station", 150, 650, 23.3, 23.3, "red", context);
        dockingStationButton.draw()
      } else {
        return;
      }


      this.selection = dockingStationButton;
      this.dragOffsetX = this.mouse.x - dockingStationButton.x;
      this.dragOffsetY = this.mouse.y - dockingStationButton.y;
    }, true);
  }

  updateMousePos(event) {
    this.mouse.x = (event.clientX - this.canvasOffset.left) // (this.canvasOffset.right - this.canvasOffset.left) * canvas.width;
    this.mouse.y = (event.clientY - this.canvasOffset.top) // (this.canvasOffset.bottom - this.canvasOffset.top) * canvas.height;
  }

  isOccupied() {
    let tile = this.findTile();
    return this.game.world.dockingStations.reverse().some((ds) => ds.x == tile.x && ds.y == tile.y);
  }

  findTile() {
    let gridBoxWidth = this.game.canvas.width / window.game.world.map.width
    let gridBoxHeight = this.game.canvas.height / window.game.world.map.height
    return {
      x: Math.floor(this.mouse.x / gridBoxWidth) * gridBoxWidth,
      y: Math.floor(this.mouse.y / gridBoxHeight) * gridBoxHeight
    };
  }

  reDrawEverything() {
    setBG();
    createGrid();
  }
}