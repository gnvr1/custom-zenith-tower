const board_mino_size = 21
const other_mino_size = 21
const border_width = 10
const clear_names = ["single","double","triple","quad","penta","hexa","hepta","octa","nona","deca","undeca","dodeca","trideca","quaddeca","pentdeca","hexdeca","heptdeca","octdeca","nondeca","boardwipe"]
let keys_pressed = []
class vector {
   constructor(x, y){
      if(x instanceof vector){
         this.x = x.x
         this.y = x.y
      }
      else{
         this.x = x
         this.y = y
      }
   }
   add(x, y){
      if(x instanceof vector) return new vector(this.x + x.x, this.y + x.y)
      else return new vector(this.x + x, this.y + y)
   }
   scale(scalar){
      return new vector(this.x * scalar, this.y * scalar)
   }
   is_equal(vect2){
      return (this.x == vect2.x && this.y == vect2.y)
   }
   rot_90(){
      let a = this.y
      this.y = -this.x
      this.x = a
      return this
   }
   rot_270(){
      let a = this.x
      this.x = -this.y
      this.y = a
      return this
   }
}
const kick_tables = {
   SRSp: [[new vector(0,0),new vector(-1,0),new vector(-1,1),new vector(0,-2),new vector(-1,-2) ],				      [new vector(0,0),new vector(0,1),new vector(1,1),new vector(-1,1),new vector(1,0),new vector(-1,0)],	[new vector(0,0),new vector(1,0),new vector(1,1),new vector(0,-2),new vector(1,-2) ],
      [new vector(0,0),new vector(1,0),new vector(1,-1),new vector(0,2),new vector(1,2) ],						   [new vector(0,0),new vector(1,0),new vector(1,-1),new vector(0,2),new vector(1,2)],					      [new vector(0,0),new vector(1,0),new vector(1,2),new vector(1,1),new vector(0,2),new vector(0,1) ],
      [new vector(0,0),new vector(0,-1),new vector(-1,-1),new vector(1,-1),new vector(-1,0),new vector(1,0)],	[new vector(0,0),new vector(-1,0),new vector(-1,1),new vector(0,-2),new vector(-1,-2)],				   [new vector(0,0),new vector(1,0),new vector(1,1),new vector(0,-2),new vector(1,-2) ],
      [new vector(0,0),new vector(-1,0),new vector(-1,-1),new vector(0,2),new vector(-1,2) ],					   [new vector(0,0),new vector(-1,0),new vector(-1,2),new vector(-1,1),new vector(0,2),new vector(0,1)],	[new vector(0,0),new vector(-1,0),new vector(-1,-1),new vector(0,2),new vector(-1,2) ]],
   SRSpI:[[new vector(0,0),new vector(1,0),new vector(-2,0),new vector(-2,-1),new vector(1,2) ],					   [new vector(0,0),new vector(0,1),new vector(1,1),new vector(-1,1),new vector(1,0),new vector(-1,0) ],	[new vector(0,0),new vector(-1,0),new vector(2,0),new vector(2,-1),new vector(-2,1) ],
      [new vector(0,0),new vector(-1,0),new vector(2,0),new vector(-1,-2),new vector(1,2) ],					      [new vector(0,0),new vector(-1,0),new vector(2,0),new vector(-1,2),new vector(2,-1) ],				      [new vector(0,0),new vector(1,0),new vector(1,2),new vector(1,1),new vector(0,2),new vector(0,1) ],
      [new vector(0,0),new vector(0,-1),new vector(-1,-1),new vector(1,-1),new vector(-1,0),new vector(1,0) ],	[new vector(0,0),new vector(-2,0),new vector(1,0),new vector(-2,1),new vector(1,-2) ],				      [new vector(0,0),new vector(2,0),new vector(-1,0),new vector(2,1),new vector(-1,-2) ],
      [new vector(0,0),new vector(1,0),new vector(-2,0),new vector(1,-2),new vector(-2,1) ],					      [new vector(0,0),new vector(-1,0),new vector(-1,2),new vector(-1,1),new vector(0,2),new vector(0,1) ],[new vector(0,0),new vector(1,0),new vector(-2,0),new vector(1,2),new vector(-2,-1) ]],
   ASCdx: [[new vector(0,0),new vector(-1,0),new vector(0,-1),new vector(-1,-1),new vector(0,-2),new vector(-1,-2),new vector(0,-3),new vector(-2,0),new vector(-2,-1),new vector(-3,0),new vector(-3,-1),new vector(-2,-2),new vector(-1,-3),new vector(-3,-2),new vector(-2,-3),new vector(-3,-3),new vector(1,0),new vector(1,-1),new vector(0,1),new vector(-1,1),new vector(-2,1),new vector(1,-2),new vector(-3,1),new vector(1,-3),new vector(2,0),new vector(0,2),new vector(-1,2),new vector(-2,2),new vector(-3,2),new vector(2,-1),new vector(2,-2),new vector(1,1),new vector(2,-3),new vector(-1,3),new vector(-2,3),new vector(-3,3),new vector(3,-1),new vector(3,-2),new vector(3,-3)],
      [new vector(0,0),new vector(-1,0),new vector(0,-1),new vector(-1,-1),new vector(0,-2),new vector(-1,-2),new vector(0,-3),new vector(-2,0),new vector(-2,-1),new vector(-3,0),new vector(-3,-1),new vector(-2,-2),new vector(-1,-3),new vector(-3,-2),new vector(-2,-3),new vector(-3,-3),new vector(1,0),new vector(1,-1),new vector(0,1),new vector(-1,1),new vector(-2,1),new vector(1,-2),new vector(-3,1),new vector(1,-3),new vector(2,0),new vector(0,2),new vector(-1,2),new vector(-2,2),new vector(-3,2),new vector(2,-1),new vector(2,-2),new vector(1,1),new vector(2,-3),new vector(-1,3),new vector(-2,3),new vector(-3,3),new vector(3,-1),new vector(3,-2),new vector(3,-3)],
      [new vector(0,0),new vector(1,0),new vector(0,-1),new vector(1,-1),new vector(0,-2),new vector(1,-2),new vector(0,-3),new vector(2,0),new vector(2,-1),new vector(3,0),new vector(3,-1),new vector(2,-2),new vector(1,-3),new vector(3,-2),new vector(2,-3),new vector(3,-3),new vector(-1,0),new vector(-1,-1),new vector(0,1),new vector(1,1),new vector(2,1),new vector(-1,-2),new vector(3,1),new vector(-1,-3),new vector(-2,0),new vector(0,2),new vector(1,2),new vector(2,2),new vector(3,2),new vector(-2,-1),new vector(-2,-2),new vector(-1,1),new vector(-2,-3),new vector(1,3),new vector(2,3),new vector(3,3),new vector(-3,-1),new vector(-3,-2),new vector(-3,-3)],
      [new vector(0,0),new vector(1,0),new vector(0,-1),new vector(1,-1),new vector(0,-2),new vector(1,-2),new vector(0,-3),new vector(2,0),new vector(2,-1),new vector(3,0),new vector(3,-1),new vector(2,-2),new vector(1,-3),new vector(3,-2),new vector(2,-3),new vector(3,-3),new vector(-1,0),new vector(-1,-1),new vector(0,1),new vector(1,1),new vector(2,1),new vector(-1,-2),new vector(3,1),new vector(-1,-3),new vector(-2,0),new vector(0,2),new vector(1,2),new vector(2,2),new vector(3,2),new vector(-2,-1),new vector(-2,-2),new vector(-1,1),new vector(-2,-3),new vector(1,3),new vector(2,3),new vector(3,3),new vector(-3,-1),new vector(-3,-2),new vector(-3,-3)],
      [new vector(0,0),new vector(-1,0),new vector(0,-1),new vector(-1,-1),new vector(0,-2),new vector(-1,-2),new vector(0,-3),new vector(-2,0),new vector(-2,-1),new vector(-3,0),new vector(-3,-1),new vector(-2,-2),new vector(-1,-3),new vector(-3,-2),new vector(-2,-3),new vector(-3,-3),new vector(1,0),new vector(1,-1),new vector(0,1),new vector(-1,1),new vector(-2,1),new vector(1,-2),new vector(-3,1),new vector(1,-3),new vector(2,0),new vector(0,2),new vector(-1,2),new vector(-2,2),new vector(-3,2),new vector(2,-1),new vector(2,-2),new vector(1,1),new vector(2,-3),new vector(-1,3),new vector(-2,3),new vector(-3,3),new vector(3,-1),new vector(3,-2),new vector(3,-3)],
      [new vector(0,0),new vector(1,0),new vector(0,-1),new vector(1,-1),new vector(0,-2),new vector(1,-2),new vector(0,-3),new vector(2,0),new vector(2,-1),new vector(3,0),new vector(3,-1),new vector(2,-2),new vector(1,-3),new vector(3,-2),new vector(2,-3),new vector(3,-3),new vector(-1,0),new vector(-1,-1),new vector(0,1),new vector(1,1),new vector(2,1),new vector(-1,-2),new vector(3,1),new vector(-1,-3),new vector(-2,0),new vector(0,2),new vector(1,2),new vector(2,2),new vector(3,2),new vector(-2,-1),new vector(-2,-2),new vector(-1,1),new vector(-2,-3),new vector(1,3),new vector(2,3),new vector(3,3),new vector(-3,-1),new vector(-3,-2),new vector(-3,-3)],
      [new vector(0,0),new vector(-1,0),new vector(0,-1),new vector(-1,-1),new vector(0,-2),new vector(-1,-2),new vector(0,-3),new vector(-2,0),new vector(-2,-1),new vector(-3,0),new vector(-3,-1),new vector(-2,-2),new vector(-1,-3),new vector(-3,-2),new vector(-2,-3),new vector(-3,-3),new vector(1,0),new vector(1,-1),new vector(0,1),new vector(-1,1),new vector(-2,1),new vector(1,-2),new vector(-3,1),new vector(1,-3),new vector(2,0),new vector(0,2),new vector(-1,2),new vector(-2,2),new vector(-3,2),new vector(2,-1),new vector(2,-2),new vector(1,1),new vector(2,-3),new vector(-1,3),new vector(-2,3),new vector(-3,3),new vector(3,-1),new vector(3,-2),new vector(3,-3)],
      [new vector(0,0),new vector(1,0),new vector(0,-1),new vector(1,-1),new vector(0,-2),new vector(1,-2),new vector(0,-3),new vector(2,0),new vector(2,-1),new vector(3,0),new vector(3,-1),new vector(2,-2),new vector(1,-3),new vector(3,-2),new vector(2,-3),new vector(3,-3),new vector(-1,0),new vector(-1,-1),new vector(0,1),new vector(1,1),new vector(2,1),new vector(-1,-2),new vector(3,1),new vector(-1,-3),new vector(-2,0),new vector(0,2),new vector(1,2),new vector(2,2),new vector(3,2),new vector(-2,-1),new vector(-2,-2),new vector(-1,1),new vector(-2,-3),new vector(1,3),new vector(2,3),new vector(3,3),new vector(-3,-1),new vector(-3,-2),new vector(-3,-3)],
      [new vector(0,0),new vector(-1,0),new vector(0,-1),new vector(-1,-1),new vector(0,-2),new vector(-1,-2),new vector(0,-3),new vector(-2,0),new vector(-2,-1),new vector(-3,0),new vector(-3,-1),new vector(-2,-2),new vector(-1,-3),new vector(-3,-2),new vector(-2,-3),new vector(-3,-3),new vector(1,0),new vector(1,-1),new vector(0,1),new vector(-1,1),new vector(-2,1),new vector(1,-2),new vector(-3,1),new vector(1,-3),new vector(2,0),new vector(0,2),new vector(-1,2),new vector(-2,2),new vector(-3,2),new vector(2,-1),new vector(2,-2),new vector(1,1),new vector(2,-3),new vector(-1,3),new vector(-2,3),new vector(-3,3),new vector(3,-1),new vector(3,-2),new vector(3,-3)],
      [new vector(0,0),new vector(-1,0),new vector(0,-1),new vector(-1,-1),new vector(0,-2),new vector(-1,-2),new vector(0,-3),new vector(-2,0),new vector(-2,-1),new vector(-3,0),new vector(-3,-1),new vector(-2,-2),new vector(-1,-3),new vector(-3,-2),new vector(-2,-3),new vector(-3,-3),new vector(1,0),new vector(1,-1),new vector(0,1),new vector(-1,1),new vector(-2,1),new vector(1,-2),new vector(-3,1),new vector(1,-3),new vector(2,0),new vector(0,2),new vector(-1,2),new vector(-2,2),new vector(-3,2),new vector(2,-1),new vector(2,-2),new vector(1,1),new vector(2,-3),new vector(-1,3),new vector(-2,3),new vector(-3,3),new vector(3,-1),new vector(3,-2),new vector(3,-3)],
      [new vector(0,0),new vector(1,0),new vector(0,-1),new vector(1,-1),new vector(0,-2),new vector(1,-2),new vector(0,-3),new vector(2,0),new vector(2,-1),new vector(3,0),new vector(3,-1),new vector(2,-2),new vector(1,-3),new vector(3,-2),new vector(2,-3),new vector(3,-3),new vector(-1,0),new vector(-1,-1),new vector(0,1),new vector(1,1),new vector(2,1),new vector(-1,-2),new vector(3,1),new vector(-1,-3),new vector(-2,0),new vector(0,2),new vector(1,2),new vector(2,2),new vector(3,2),new vector(-2,-1),new vector(-2,-2),new vector(-1,1),new vector(-2,-3),new vector(1,3),new vector(2,3),new vector(3,3),new vector(-3,-1),new vector(-3,-2),new vector(-3,-3)],
      [new vector(0,0),new vector(1,0),new vector(0,-1),new vector(1,-1),new vector(0,-2),new vector(1,-2),new vector(0,-3),new vector(2,0),new vector(2,-1),new vector(3,0),new vector(3,-1),new vector(2,-2),new vector(1,-3),new vector(3,-2),new vector(2,-3),new vector(3,-3),new vector(-1,0),new vector(-1,-1),new vector(0,1),new vector(1,1),new vector(2,1),new vector(-1,-2),new vector(3,1),new vector(-1,-3),new vector(-2,0),new vector(0,2),new vector(1,2),new vector(2,2),new vector(3,2),new vector(-2,-1),new vector(-2,-2),new vector(-1,1),new vector(-2,-3),new vector(1,3),new vector(2,3),new vector(3,3),new vector(-3,-1),new vector(-3,-2),new vector(-3,-3)]],
   rotation_disabled: []
}
let the_contender
const settings = {
   handling: {
      SDF: 1000,
      ARR: 0.03,
      DAS: 0.15
   },
   controls: {
      left: "ArrowLeft",
      right: "ArrowRight",
      soft_drop: "ArrowDown",
      hard_drop: "Space",
      rot_cw: "ArrowUp",
      rot_180: "KeyA",
      rot_ccw: "KeyZ",
      hold: "ShiftLeft",
   },
   other: {
      fakeamount: 300
   }
}
let edited_control = undefined
const piece_colors = ["cyan","blue","orange","yellow","lime","magenta","red"]
const climb_speed_colours = ["black","firebrick","orange","lime","cornflowerblue","magenta","lightsalmon","palegreen","cyan","pink"]
function tag(x=undefined,y=undefined){
   if(x === undefined) return $("<div>")
   else if(y === undefined) return $("<div>").css("width", x).css("height", x).css("min-width", x).css("min-height", x)
   else return $("<div>").css("width", x).css("height", y).css("min-width", x).css("min-height", y)
}
function show_settings(){
   Object.keys(settings.handling).forEach(key => {
      $("#"+key+"-input").val(settings.handling[key])
   })
   Object.keys(settings.controls).forEach(key => {
      $("#"+key+"-input").html(settings.controls[key]).on("click",()=>{
         if(edited_control) $("#"+edited_control+"-input").css("outline","none")
         edited_control = key
         $("#"+key+"-input").css("outline","white solid 4px")
      })
   })
   Object.keys(settings.other).forEach(key => {
      $("#"+key+"-input").val(settings.other[key])
   })
   document.getElementsByTagName("dialog")[0].showModal()
}
function hide_settings(save){
   if(save){
      Object.keys(settings.handling).forEach(key => {
         settings.handling[key] = Number.isNaN(parseFloat($("#"+key+"-input").val()))? 1 : parseFloat($("#"+key+"-input").val())
      })
      Object.keys(settings.controls).forEach(key => {
         settings.controls[key] = $("#"+key+"-input").html()
      })
      Object.keys(settings.other).forEach(key => {
         settings.other[key] = Number.isNaN(parseInt($("#"+key+"-input").val()))? 1 : parseInt($("#"+key+"-input").val())
      })
      refill_tower()
   }
   document.getElementsByTagName("dialog")[0].close()
}
const polyomino_amounts = [1,1,1,2,7,18,60,196,704,2500,9189]
function generate_polyominoes(size, bound = 10, num = -1){
   let polyominoes = []
   let old_polyominoes = [[new vector(0,0)]] 
   if(size > 2 && size <= 9) old_polyominoes = generate_polyominoes(size-1, bound)
   if(size > 9) old_polyominoes = [generate_polyominoes(size - 1, bound, Math.floor(Math.random() * 9189))]
   if(size == 1) return num == 0? old_polyominoes[0] : old_polyominoes
   old_polyominoes.forEach(polyomino => {
      let extremes = [0, 0, 0, 0]
      let tocheck = []
      polyomino.forEach(mino => {
         if(mino.x < extremes[0]) extremes[0] = mino.x
         if(mino.x > extremes[1]) extremes[1] = mino.x
         if(mino.y < extremes[2]) extremes[2] = mino.y
         if(mino.y > extremes[3]) extremes[3] = mino.y
         let dirs = [new vector(-1, 0), new vector(1, 0), new vector(0, 1), new vector(0, -1)]
         dirs.forEach(dir => tocheck.push(mino.add(dir)))
      })
      tocheck = tocheck.filter((pos, index) => !polyomino.find(mino => mino.is_equal(pos)) && !tocheck.slice(0,index).find(mino => mino.is_equal(pos)))
      tocheck.forEach((pos) => {
         let specific_extremes = [...extremes]
         if(pos.x < specific_extremes[0]) specific_extremes[0] = pos.x
         if(pos.x > specific_extremes[1]) specific_extremes[1] = pos.x
         if(pos.y < specific_extremes[2]) specific_extremes[2] = pos.y
         if(pos.y > specific_extremes[3]) specific_extremes[3] = pos.y
         let new_polyomino = polyomino.map(mino => new vector(mino))
         new_polyomino.push(pos)
         let size = new vector(specific_extremes[1] - specific_extremes[0] + 1, specific_extremes[3] - specific_extremes[2] + 1)
         if(size.x > bound || size.y > bound) return
         new_polyomino = new_polyomino.map(mino => mino.add(specific_extremes[0] * (-1), specific_extremes[2] * (-1)))
         let versions = []
         for(let i = 0; i < 4; i++){
            size = new vector(size.y, size.x)
            new_polyomino = new_polyomino.map(mino => mino.rot_90().add(0, size.y - 1))
            versions.push(new_polyomino.map(pos => new vector(pos)).sort((a, b) => (a.y == b.y)? (a.x - b.x) : (a.y - b.y)))
         }
         versions.sort((a,b) => {
            let id = a.findIndex((v,ai) => !b[ai].is_equal(v))
            if(id == -1) return 0
            else return (a[id].y == b[id].y)? (a[id].x - b[id].x) : (a[id].y - b[id].y)
         })
         new_polyomino = versions[0]
         let duplicate = false
         let bounds = [0, polyominoes.length-1]
         while(bounds[1] - bounds[0] >= 0){
            let p_index = Math.floor((bounds[0] + bounds[1]) / 2)
            let id = new_polyomino.findIndex((v,minoi) => !polyominoes[p_index][minoi].is_equal(v))
            if(id == -1) {duplicate = true; break}
            else if(((new_polyomino[id].y == polyominoes[p_index][id].y)? (new_polyomino[id].x - polyominoes[p_index][id].x) : (new_polyomino[id].y - polyominoes[p_index][id].y)) < 0) bounds[1] = p_index - 1
            else bounds[0] = p_index + 1
         }
         if(!duplicate) polyominoes.splice(bounds[0],0,new_polyomino)
      })
   })
   if(polyominoes.length == 0) return old_polyominoes[0]
   if(num >= 0) {
      if(num < polyominoes.length) return polyominoes[num]
      else return polyominoes[Math.floor(Math.random() * polyominoes.length)]
   }
   return polyominoes
}
function generate_word(length) {
   const samogloski = "aeiouy"
   const spolgloski = "bcdfghjklmnpqrstvwxz"
   const laczace = "bcdfghklmnprst"
   let streak = 0
   let curtype = -1
   const random = (type) => {
      let to_return = ""
      if(type == 0) to_return = samogloski[Math.floor(Math.random() * samogloski.length)]
      else if(curtype == 1) to_return = laczace[Math.floor(Math.random() * laczace.length)]
      else to_return = spolgloski[Math.floor(Math.random() * spolgloski.length)] 
      if(curtype != type){curtype = type; streak = 1}
      return to_return
   }
   let word = ""
   while(word.length < length) {
      streak++
      if("hjqvwxz".includes(word[word.length-1])) word += random(0)
      else if((streak < 3 && length > 2) || streak == 1) word += (Math.random() < 1/3)? random(0) : random(1)
      else word += random(1 - curtype)
   }
   //console.log(word)
   return word.toUpperCase()
}
function input_pressed(e){
   let key = e.code
   if(key.length == 1) key = key.toLowerCase()
   keys_pressed = keys_pressed.filter(pressed => pressed != key)
   keys_pressed.push(key)
   if(edited_control){
      $("#"+edited_control+"-input").html(key).css("outline","none")
      edited_control = undefined
   }
}
function input_depressed(e){
   let key = e.code
   if(key.length == 1) key = key.toLowerCase()
   keys_pressed = keys_pressed.filter(pressed => pressed != key)
}

function deepClone(obj) {
   if (obj === null || typeof obj !== "object") return obj;
   const clone = Object.create(Object.getPrototypeOf(obj));
   for (const key of Reflect.ownKeys(obj)) {
      clone[key] = deepClone(obj[key]);
   }
   return clone;
}
function begin(){
   let contender = new player()
   tower.push(contender)
   the_contender = contender
}
function stop(){
   tower.forEach(board => window.clearInterval(board.update_timer))
}
let tower = []
function refill_tower(){
   tower.forEach((fp, index) => {window.clearInterval(fp.update_timer); delete tower[index]})
   tower = []
   for(let i = 0; i < settings.other.fakeamount; i++){
      let new_contender = new fake_player(0.02 + Math.pow(i/settings.other.fakeamount,3) * 0.98)
      new_contender.time = Math.random() * 300
      new_contender.altitude = new_contender.apm / 30 * new_contender.time
      tower.push(new_contender)
   }
   for(let i = 0; i < 2000; i+=1){
      tower.forEach(player => {player.update()})
   }
   tower.forEach(player => {
      window.clearInterval(player.update_timer)
      window.setTimeout(() => {player.update_timer = window.setInterval(() => {player.update()}, 500)}, Math.random() * 500)
   })
   console.log("extra_updates_done!!!")
}
refill_tower()