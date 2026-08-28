let modblocks = [
   {normal: 0, reversed: 1, state: "normal", selected: false},{normal: 2, reversed: 3, state: "normal", selected: false},{normal: 4, reversed: 5, state: "normal", selected: false},
   {normal: 6, reversed: 7, state: "normal", selected: false},{normal: 8, reversed: 9, state: "normal", selected: false},{normal: 10, reversed: 11, state: "normal", selected: false},
   {normal: 12, reversed: 13, state: "normal", selected: false},{normal: 14, reversed: 15, state: "normal", selected: false},{normal: 16, reversed: 17, state: "normal", selected: false},
   {normal: 18, reversed: 19, state: "normal", selected: false},{normal: 20, reversed: 21, state: "normal", selected: false}
]
function rerender_mods(){
   $("#available-mods,#selected-mods").empty()
   modblocks.forEach((modblock,index) => {
      let block = tag(120).addClass("modblock")
      let modtext = tag().addClass("modtext")
      let reverser = tag(30).html("&#x21BB;").addClass("reverser").on("click",(e) => {
         e.stopPropagation()
         modblocks[index].state = modblocks[index].state == "normal"? "reversed" : "normal"
         if(modblock.state == "normal"){
            modtext.html(mods[modblock.normal].name.toUpperCase());
            block.css("background","linear-gradient(160deg, blue, cornflowerblue, blue)").css("color","white").css("transform","rotate(0deg)").css("text-shadow","none")
            modtext.css("transform","rotate(0deg)")
         }
         if(modblock.state == "reversed"){
            modtext.html(mods[modblock.reversed].name.toUpperCase());
            block.css("background","linear-gradient(160deg, red, lightsalmon, red)").css("color","black").css("text-shadow","0 0 4px red").css("transform","rotate(180deg)")
            modtext.css("transform","rotate(-180deg)")
         }
         block.css("font-size", Math.min(1.2, 9 / Math.max(...modtext.text().split(" ").map(word => word.length)))+"em")
      })
      if(modblock.state == "normal"){
         modtext.html(mods[modblock.normal].name.toUpperCase());
         block.css("background","linear-gradient(160deg, blue, cornflowerblue, blue)").css("color","white").css("transform","rotate(0deg)")
         modtext.css("transform","rotate(0deg)")
      }
      if(modblock.state == "reversed"){
         modtext.html(mods[modblock.reversed].name.toUpperCase());
         block.css("background","linear-gradient(160deg, red, lightsalmon, red)").css("color","black").css("text-shadow","0 0 4px red").css("transform","rotate(180deg)")
         modtext.css("transform","rotate(-180deg)")
      }
      block.append(reverser,modtext).css("font-size", Math.min(1.2, 9 / Math.max(...modtext.text().split(" ").map(word => word.length)))+"em").on("click", () => {
         block.add($("#selected-mods p")).detach()
         modblocks[index].selected = !modblocks[index].selected
         if(modblocks[index].selected){
            $("#selected-mods").append(block)
         }
         else {
            $("#available-mods").append(block)
         }
         if(!document.querySelector("#selected-mods div")) $("#selected-mods").append("<p>NO MODS SELECTED</p>")
      })
      if(modblock.selected){
         $("#selected-mods").append(block)
      }
      else {
         $("#available-mods").append(block)
      }
   })
   if(!document.querySelector("#selected-mods div")) $("#selected-mods").append("<p>NO MODS SELECTED</p>")
}
rerender_mods()