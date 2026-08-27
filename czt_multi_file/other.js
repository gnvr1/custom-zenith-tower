const board_mino_size = 21
const other_mino_size = 21
const border_width = 10
const clear_names = ["single","double","triple","quad","penta","hexa","hepta","octa","nona","deca","undeca","dodeca","trideca","quaddeca","pentdeca","hexdeca","heptdeca","octdeca","nondeca","boardwipe"]
let keys_pressed = []
class vector {
   constructor(x, y){
      this.x = x; this.y = y;
   }
   add(vect2){
      return new vector(this.x + vect2.x, this.y + vect2.y)
   }
   scale(scalar){
      return new vector(this.x * scalar, this.y * scalar)
   }
   is_equal(vect2){
      return (this.x == vect2.x && this.y == vect2.y)
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
   none: [],
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
   tower = []
   for(let i = 0; i < settings.other.fakeamount; i++){
      let new_contender = new fake_player(0.02 + Math.pow(i/settings.other.fakeamount,5) * 0.98)
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