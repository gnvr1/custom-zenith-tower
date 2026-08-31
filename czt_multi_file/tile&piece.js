class tile {
   type = 0
   subtype = 0
   opacity = 1
   constructor(type, subtype = 0, opacity = 1){this.type = type; this.subtype = subtype; this.opacity = opacity}
   tile_render_info(){
      if(this.type == 0) return "none"
      if(this.type == 1) return piece_colors[this.subtype-1]
      if(this.type == 2) return this.subtype == 0? "darkgray" : "#5B5"
      if(this.type == 3) return "#555"
      if(this.type == 4) return "indigo"
      if(this.type == 5) return "firebrick"
   }
}
class piece {
   tile_type = 0
   tile_positions = []
   center_is_in_a_middle_of_a_tile = false
   kick_table = []
   name = "O"
   spin_detection = "immobility"
   position_offset = new vector(0,0)
   override_attack_table = null
   constructor(name, tile_positions, tile_type, citm = true, kick_table = kick_tables.SRSp, override_attack_table = {}, spin_detection = "immobility"){
      this.name = name; this.tile_positions = tile_positions; this.center_is_in_a_middle_of_a_tile = citm; this.kick_table = kick_table;
      this.override_attack_table = override_attack_table; this.spin_detection = spin_detection
      if(Array.isArray(tile_type)) this.tile_type = tile_type
      else {
         this.tile_type = []
         this.tile_positions.forEach(element => {
            let obj = undefined
            if(Number.isInteger(tile_type)){
               obj = new tile(1, tile_type)
            }
            else obj = tile_type
            this.tile_type.push(obj)
         })
      }
   }
   rendered_tag(filter = "none"){
      let extremes = {}
      this.tile_positions.forEach(tile => {
         if(!(tile.x <= extremes.xmax)) extremes.xmax = tile.x
         if(!(tile.x >= extremes.xmin)) extremes.xmin = tile.x
         if(!(tile.y <= extremes.ymax)) extremes.ymax = tile.y
         if(!(tile.y >= extremes.ymin)) extremes.ymin = tile.y
      })
      let avg = new vector((extremes.xmax + extremes.xmin) / 2, (extremes.ymax + extremes.ymin) / 2)
      let size = new vector(extremes.xmax - extremes.xmin + 1, extremes.ymax - extremes.ymin + 1)
      let scale = 1
      if(size.x > 4 || size.y > 2){
         scale = Math.min(4/size.x, 2.5/size.y)
      }
      let html = tag().css("position", "relative").css("scale", scale).css("filter",filter)
      this.tile_positions.forEach((mino,index) => {
         let block = tag(other_mino_size)
            .addClass("shown-mino border-outset")
            .css("top", (-mino.y-0.5+avg.y) * other_mino_size)
            .css("left", (mino.x-avg.x-0.5) * other_mino_size)
            .css("--bgcolor", this.tile_type[index].tile_render_info())
            .css("border-width", 2)
         if(this.tile_type[index].type == 5) block.html("&#x2622;").css("font-size", other_mino_size).css("color", this.tile_type[index].subtype.primed? "yellow" : "maroon").css("text-shadow","none").css("line-height","1")
         html.append(block)
      })
      return html
   }
}