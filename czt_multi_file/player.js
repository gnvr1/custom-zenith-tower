class player {
   ruleset = {
      board_dimensions: new vector(10,20),
      board_dimension_mults: new vector(1,1),
      attack_table: {
         normal: [0,0,1,2,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
         spin: [0,0,1,2,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
      },
      queue_size: 5,
      hold_cooldown: 1,
      garbage_messiness: 0.03,
      garbage_messiness_per_floor: 0.03,
      garbage_well_amount: 1,
      garbage_entering_time: 0.08333,
      instant_garbage_entry: false,
      garbage_cap: 8,
      absolute_garbage_cap: undefined,
      garbage_favour: 30,
      garbage_favour_per_floor: -3,
      garbage_gathering: true,
      garbage_gathering_max_messiness: 0.15,
      garbage_entry_delay: [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5],
      cancelling_mult: 1,
      gravity: 1.2,
      gravity_increase: 0.03,
      lock_delay: 0.5,
      lock_delay_resets: 14,
      attack_mult: 1,
      altitude_mult: 1,
      cancelling_sickness_gain_mult: 1,
      cancelling_sickness_tresholds: {
         o: 20,
         less_garbage_delay: 25,
         lj: 30,
         sz: 40,
         i5: 40,
         lj2: 50,
         ti: 50,
         sz2: 60
      },
      cancelling_sickness_downgrade_pentas_from_special_piece: true,
      cancelling_sickness_garbage_received_penalty_coefficient: 0.001,
      KO_altitude_gain: 15,
      passive_altitude_gain: 1,
      climb_xp_gain_mult: 1,
      climb_xp_gain_methods: {clear: true,block: true,send: true},
      climb_xp_loss_factor: 3,
      base_targeting_factor: 3,
      targeting_grace_mult: 1,
      targeting_grace_max: 18,
      targeting_grace_effective_max: 12,
      targeting_grace_max_messiness_reduction: 0.18,
      targeting_grace_max_targeting_reduction: 3,
      targeting_grace_garbage_mult_per_point: 0.05,
      targeting_grace_garbage_mult_threshold: 8,
      targeting_grace_release_time: [4.8, 3.9, 2.1, 1.4, 1.3, 0.9, 0.6, 0.4, 0.3, 0.2],
      targeting_reduction_in_danger: 1.5,
      fatigue: [
         {time: 180, effect: (player) => {player.ruleset.base_targeting_factor++}, description: ""},
         {time: 300, effect: (player) => {player.ruleset.base_targeting_factor++}, description: ""},
         {time: 420, effect: (player) => {player.ruleset.base_targeting_factor++}, description: ""},
         {time: 480, effect: (player) => {player.manual_delayed_injection(2, 0.8, "perma")}, description: "FATIGUE SETS IN… +2 PERMANENT LINES"},
         {time: 540, effect: (player) => {player.garbage_received_mults.fatigue += 0.25}, description: "YOUR BODY GROWS WEAK… receive 25% more garbage"},
         {time: 600, effect: (player) => {player.manual_delayed_injection(3, 0.8, "perma")}, description: "ALL SENSES BLUR TOGETHER… +3 PERMANENT LINES"},
         {time: 660, effect: (player) => {player.garbage_received_mults.fatigue += 0.25}, description: "YOUR CONSCIOUSNESS FADES… receive 25% more garbage"},
         {time: 720, effect: (player) => {player.manual_delayed_injection(5, 0.8, "perma")}, description: "THIS IS THE END. +5 PERMANENT LINES"},
      ],
      available_pieces: [
         new piece("I",[new vector(-2,0),new vector(-1,0),new vector(0,0),new vector(1,0)],1,false,kick_tables.SRSpI),
         new piece("J",[new vector(-1,1),new vector(-1,0),new vector(0,0),new vector(1,0)],2),
         new piece("L",[new vector(-1,0),new vector(0,0),new vector(1,0),new vector(1,1)],3),
         new piece("O",[new vector(0,0),new vector(-1,0),new vector(0,-1),new vector(-1,-1)],4,false),
         new piece("S",[new vector(-1,0),new vector(0,0),new vector(0,1),new vector(1,1)],5),
         new piece("T",[new vector(-1,0),new vector(0,0),new vector(0,1),new vector(1,0)],6, true, kick_tables.SRSp, {spin: [0,2,4,6,10,12,14,16,18,20,22,24,26,28,30]},"weirdplus"),
         new piece("Z",[new vector(-1,1),new vector(0,1),new vector(0,0),new vector(1,0)],7),
         new piece("I5",[new vector(-2,0),new vector(-1,0),new vector(0,0),new vector(1,0),new vector(2,0)],1,true,kick_tables.SRSpI),
      ],
      bag: ["I","J","L","O","S","T","Z"],
      bag_refresh_at: 0,
      ghost_piece: true,
      combo_multiplier: 0.25,
      btb_chaining_thresholds: [1],
      btb_charging_starting_btb: 4,
      btb_charging_starting_surge: 1,
      btb_charging_surge_per_btb: 1,
      naked_single_sends: true,
      pc_attacks: 3,
      pc_btb: 2,
      cc_attacks: 0,
      cc_btb: 0,
      lc_are: 0,
      rounding: "rng",
      garbage_line_protection_max_stacks: 0,
      garbage_line_protection_reduction_per_line: 0.5,
      danger_protection: true,
      minimum_action_text_opacity: 0,
      action_text_colour: "white",
      floor_tresholds: [undefined,0,50,150,300,450,650,850,1100,1350,1650,Infinity],
      shorter_region_tresholds: [2000,2400,2800,3200,3600,4000],
      other_region_interval: 500,
      windup_power_first_increase_altitude: 4000,
      windup_power_increase_interval: 500,
      windup_power_increase_amount: 1,
      floor_barriers: true,
      barrier_skip_actions: ["line_clear", "garbage_send", "garbage_block"],
      floor_cross_altitude: 3,
      windup_threshold: 8,
      windup_maximum_attack: 16
   }
   current_board_dimensions = this.ruleset.board_dimensions.scale(1)
   board = []
   controlled_piece = new piece("S",[new vector(-1,0),new vector(0,0),new vector(0,1),new vector(1,1)],5)
   piece_placed = false
   piece_position = new vector(4,21)
   piece_partial_movement = 0
   piece_rotation = 0
   piece_direction = -1
   piece_as_time = 0
   piece_spinnin = 0
   piece_hyperkick = true
   ghost_piece_offset = 0
   hold = undefined
   hold_cooldown = (this.ruleset.hold_cooldown >= 0)? 0 : -1
   lock_delay = this.ruleset.lock_delay
   lock_delay_resets = this.ruleset.lock_delay_resets
   queue = []
   bag = [...this.ruleset.bag]
   garbage_queue = []
   windups = []
   chunk_started = false
   entering_garbage = []
   last_garbage_entry = 0
   current_garbage_pattern = undefined
   garbage_entry_row = 0
   action_text = ""
   last_action_text_update = 0
   pc_text = ""
   last_pc_text_update = 0
   top_text = []
   last_top_text_update = 0
   climb_speed = 1
   climb_xp = 0
   climb_xp_lock_remaining = 0
   lock_csp = 2
   lock_time = 5
   bonus_altitude = 0
   floor = 1
   current_region_threshold = this.ruleset.shorter_region_tresholds.shift()
   garbage_received_boosts = {}
   garbage_received_mults = {fatigue: 1}
   targeting_grace = 0
   targeting_grace_last_released = Date.now()
   clear_text = ""
   combo = -1
   btb = -1
   powah = 0
   separate_garbage = [0,0]
   cancelling_sickness = 0
   cancelling_sickness_last_sz_spins = []
   cancelling_sickness_last_reduced = Date.now()
   cancelling_sickness_pieces_since_reduced = 0
   cancelling_sickness_last_quad_columns = []
   cancelling_sickness_i5_received = false
   time_of_last_update = Date.now()
   last_update_keys_pressed = []
   windup_power_increase_altitude = this.ruleset.windup_power_first_increase_altitude
   clutch = false
   mods = []
   base_fatigue_removed = false
   last_attacker = undefined
   stars = []
   clear_whites = []
   altitude = 0
   pieces_placed = 0
   attacks_created = 0
   time = 0.00001
   kos = 0
   attacks_received = 0
   attacks_cancelled = 0
   attacks_sent = 0
   garbage_lines_cleared = 0
   holds = 0
   highest_btb = 0
   highest_combo = 0
   highest_climb_speed = 1
   total_lines_cleared = 0
   all_clears = 0
   recalculate_board_dimensions(){
      let target_board_dimensions = new vector(Math.max(4, this.ruleset.board_dimensions.x * this.ruleset.board_dimension_mults.x), Math.max(4, this.ruleset.board_dimensions.y * this.ruleset.board_dimension_mults.y))
      while(this.current_board_dimensions.x != target_board_dimensions.x){
         if(this.current_board_dimensions.x < target_board_dimensions.x){
            if(this.current_board_dimensions.x % 2 == 0) this.board.forEach(row => row.unshift(new tile((row.find(cell => cell.type == 2))? 2 : 0)))
            else this.board.forEach(row => row.push(new tile((row.find(cell => cell.type == 2))? 2 : 0)))
            this.current_board_dimensions.x++
         }
         else{
            if(this.current_board_dimensions.x % 2 == 1) this.board.forEach(row => row.shift())
            else this.board.forEach(row => row.pop())
            this.current_board_dimensions.x--
         }
      }
      while(this.current_board_dimensions.y != target_board_dimensions.y){
         if(this.current_board_dimensions.y < target_board_dimensions.y){
            let new_row = []
            for(let i = 0; i < this.current_board_dimensions.x; i++) new_row.push(new tile(0))
            this.board.push(new_row)
            this.current_board_dimensions.y++
         }
         else{
            this.board.pop()
            this.current_board_dimensions.y--
         }
      }
   }
   reset_board(){
      this.board = []
      for(let i = 0; i < this.current_board_dimensions.y + 20; i++){
         this.board.push([])
         for(let j = 0; j < this.current_board_dimensions.x; j++){
            this.board[i].push(new tile(0))
         }
      }
   }
   render(div){
      let scalar = 20 / this.current_board_dimensions.y
      
      div.addClass("column").empty()
      let top_text = tag("auto","2em").css("margin-bottom", 10).addClass("big")
      if(this.top_text.length > 0) top_text.html(this.top_text[0].text).css("opacity", 1 - (Date.now() - this.last_top_text_update - this.top_text[0].time * 1000) / 400).css("color","white")
      let top = tag().css("align-items","stretch").css("scale", Math.min(this.current_board_dimensions.y / 6, 1))
      let left = tag(other_mino_size*6,"default").addClass("column").css("align-items","flex-end").css("justify-content","space-between")
      let hold = tag(other_mino_size * 5.5, 2 * border_width + other_mino_size * 3.5)
      if(this.ruleset.hold_cooldown > -1){
         hold.css("border", border_width + "px solid white").css("border-right","none").addClass("column").css("background","rgba(0,0,0,0.85)")
         if(this.hold) hold.append(this.hold.rendered_tag(this.hold_cooldown == 0? "" : "opacity(45%)"))
      }
      let clear_info = tag("default",board_mino_size * 8).css("align-items","flex-end").css("text-align","right").css("padding",`20px ${border_width+5}px 0 0`).css("white-space","nowrap").css("color","white").css("justify-content","flex-start").addClass("column")
      let action_text = tag().html(this.action_text).css("opacity", Math.max(1.4-(Date.now()-this.last_action_text_update)/1500, this.ruleset.minimum_action_text_opacity)).css("display","block").addClass("big").css("color", this.ruleset.action_text_colour)
      let btb_displays = tag().css("margin-top", (Math.sqrt(Math.sqrt(this.powah+8))-2.5)/-2 + "em")
      let the_btb_display = tag().html("B2B x" + this.btb).css("display","block").css("visibility",(this.btb > 0)? "visible" : "hidden").css("margin-right",10).css("position","relative").css("top",3)
      let surge_display = tag().html("&#x272E;" + this.powah + "&#x272E;").css("display",(this.powah > 0)? "block" : "none").css("color","yellow").css("font-size", (Math.sqrt(Math.sqrt(this.powah+8))-0.6) + "em").addClass("powah")
      btb_displays.append(the_btb_display,surge_display)
      let combo_display = tag().html((this.combo > 0)? this.combo + " COMBO" : "").css("display","block").addClass("big").css("opacity", 1-(Date.now()-this.last_action_text_update)/1600)
      clear_info.append(action_text,btb_displays,combo_display)
      let stats = tag(other_mino_size * 6, board_mino_size * 8)
         .addClass("column").css("align-items","flex-end").css("text-align","right").css("color","white").css("padding",`20px ${border_width+5}px 0 0`)
      //let kos_display = tag().html("KO'S<br><span class='big'>" + this.kos + "</span>").css("display","block")
      let pieces_placed_display = tag().html("PIECES<br><span class='big'>" + this.pieces_placed + "</span> (" + (this.pieces_placed / this.time).toFixed(2) + " PPS)").css("display","block").css("white-space","nowrap")
      let attack_display = tag().html("ATTACK<br><span class='big'>" + this.attacks_created + "</span> (" + (this.attacks_created / this.time * 60).toFixed(2) + " APM)").css("display","block").css("white-space","nowrap")
      let time_display = tag().html("TIME<br><span class='big'>" + Math.floor(this.time / 60) + ":" + Math.floor(this.time % 60 / 10) + Math.floor(this.time % 10) + "</span>" + (this.time % 1).toFixed(3).slice(1)).css("display","block")
      stats.append(/*kos_display,*/ pieces_placed_display, attack_display, time_display)
      left.append(hold,clear_info,stats)

      let garbage_queue_display = tag(border_width + 12, border_width + 20 * board_mino_size).css("background","rgba(0,0,0,0.85)")
      .css("border-bottom", border_width + "px solid white").css("border-left", border_width + "px solid white").css("flex-direction","column-reverse").css("justify-content","flex-start")
      this.garbage_queue.forEach(chunk => {
         for(let i = 0; i < chunk.size; i++){
            let new_part = tag(12,board_mino_size * scalar)
            if(chunk.time_in_queue >= this.ruleset.garbage_entry_delay[this.floor-1]) new_part.css("--bgcolor","#D00").css("border-width","3").addClass("border-outset")
            else if(chunk.time_in_queue >= 0.5 * this.ruleset.garbage_entry_delay[this.floor-1]) new_part.css("--bgcolor","#820").css("border-width",3).addClass("border-outset")
            else new_part.css("--bgcolor","#770").css("border-width",3).addClass("border-outset")
            if(i != 0) new_part.css("border-bottom","none")
            if(i != chunk.size-1) new_part.css("border-top","none")
            garbage_queue_display.append(new_part)
         }
      })

      let center = tag(1.5 * border_width + this.current_board_dimensions.x * board_mino_size * scalar, border_width + 20 * board_mino_size).css("position","relative").css("background","rgba(0,0,0,0.85)")
      .css("border", border_width + "px solid white").css("border-left", 0.5 * border_width + "px solid white").css("border-top","none").css("flex-direction","column-reverse")
      this.board.forEach((row, row_index) => {
         let row_tag = tag(board_mino_size * this.current_board_dimensions.x * scalar, board_mino_size * scalar).css("transform", "translateY("+ board_mino_size * scalar * -20 +"px)")
         row.forEach((cell, cell_index) => {
            let new_cell = tag(board_mino_size * scalar)
            this.controlled_piece.tile_positions.forEach((pos, pos_index) => {
               if(pos.add(this.piece_position).is_equal(new vector(cell_index, row_index)) && !this.piece_placed) {cell = this.controlled_piece.tile_type[pos_index]; new_cell.css("filter", "brightness("+(this.lock_delay / this.ruleset.lock_delay * 60 + 40 + (this.piece_spinnin?50:0))+"%)")}
               else if(pos.add(this.piece_position).add(new vector(0,-this.ghost_piece_offset)).is_equal(new vector(cell_index, row_index)) && cell.type == 0 && this.ruleset.ghost_piece && !this.piece_placed) {cell = this.controlled_piece.tile_type[pos_index]; new_cell.css("filter", "opacity(60%) blur(2px)")}
            })
            new_cell.css("background", cell.tile_render_info()).css("opacity", cell.opacity)
            if(cell.type >= 1 && cell.type <= 3) new_cell.css("--bgcolor", cell.tile_render_info()).css("border-width",2).addClass("border-outset")
            if(cell.type == 4 && cell.subtype.post[0] == 0) new_cell.text(cell.subtype.counter).css("color","white")
            row_tag.append(new_cell)
         })
         center.append(row_tag)
      })
      this.clear_whites.forEach(white => {
         let animation = tag(board_mino_size * scalar).css("position","absolute").css("top", (this.current_board_dimensions.y - white.position.y - 1) * board_mino_size * scalar)
         .css("left", white.position.x * board_mino_size * scalar).css("z-index",3).css("background", "#EEE")
         if(white.animation == 0) animation.css("transform", "scaleY("+ Math.max(0, Math.min(1, 1 - white.time/white.end_time)) +")")
         if(white.animation == 1) animation.css("scale", Math.max(0, Math.min(1, 1 - white.time/white.end_time)))
         center.append(animation)
      })
      this.stars.forEach(star => {
         let particle = tag()
         if(star.tier == 1) particle.html("&#x2605;").css("font-size",20)
         if(star.tier == 2) particle.html("&#x272E;").css("font-size",60)
         if(star.tier == 3) particle.html("&#x272F;").css("font-size",200)
         let traveled = Math.min(1, star.current_lifetime / star.travel_time)
         particle.css("color",star.color).css("position","absolute").css("top",star.orgin.y + (star.destination.y - star.orgin.y) * Math.min(1, Math.max(0, 1.5 * traveled - 0.5 * Math.pow(traveled, 3))))
         .css("left",star.orgin.x + (star.destination.x - star.orgin.x) * Math.min(1, Math.max(0, 1.5 * traveled - 0.5 * Math.pow(traveled, 3)))).css("opacity", star.defensive? (1 - (star.current_lifetime - star.travel_time - 0.1) / 0.3) : (1 - (star.current_lifetime - star.travel_time - 0.2) / 0.5))
         .css("text-shadow","0 0 5px rgba(0, 0, 0, 0.8)").css("z-index", 4)
         center.append(particle)
      })
      let pc_text = tag(this.current_board_dimensions.x * board_mino_size * scalar, 10).html(this.pc_text).css("opacity", 2-(Date.now()-this.last_pc_text_update)/1000).css("top", 0.5 * board_mino_size * this.current_board_dimensions.y * scalar - 25)
      .css("text-align","center").css("font-size","3em").css("color","white").css("position","absolute")
      if(this.windups.length > 0){
         let windup_mark = tag(50).html(["?","!","!!","!!!"][this.windups[0].chunk_amount-1]).css("color","white").css("border-radius",50).css("border", "8px solid red").css("background","black")
         .css("opacity",1-(this.windups[0].time - 0.5 - 0.5 * this.windups[0].chunk_amount)).css("position","absolute").css("font-size",30).css("font-weight", "bold").css("top",80).css("left","calc(50% - 25px)")
         center.append(windup_mark)
      }
      center.append(pc_text)

      let right = tag().addClass("column").css("align-items","flex-start").css("justify-content","flex-start")
      let queue_display
      if(this.ruleset.queue_size > 0){
         queue_display = tag(border_width + other_mino_size * 5.5, 2 * border_width + other_mino_size * (2.75 * this.ruleset.queue_size + 0.75))
         .css("border", border_width + "px solid white").css("border-left","none").addClass("column").css("background","rgba(0,0,0,0.85)").css("justify-content","space-around")
         for(let i = 0; i < this.ruleset.queue_size; i++) queue_display.append(this.queue[i].rendered_tag())
      }
      else queue_display = tag(3,3)
      let mod_names = tag().css("margin",5).addClass("column").css("text-align","left").css("align-items","flex-start")
      this.mods.forEach(mod => {
         let name = tag().html(mods[mod].name.toUpperCase()).attr("id","mod-"+mod+"-name").css("color","white")
         mod_names.append(name)
      })
      right.append(queue_display, mod_names)

      top.append(left, garbage_queue_display, center, right)

      let bottom = tag().addClass("column")
      let altitude_display = tag().html(this.altitude.toFixed(1)).addClass("big").css("color","white").css("margin-top",5)
      let floor_display = tag().html("FLOOR " + this.floor).css("color","white")
      let climb_progress_display = tag(8 * board_mino_size, board_mino_size).css("border","3px solid white").css("margin-top",8)
      .css("background", climb_speed_colours[this.climb_speed-1] ?? "#E6E6E6").css("justify-content","flex-start")
      let progress_bar = tag((8 * board_mino_size - 6) * Math.min(this.climb_xp / this.climb_speed / 4, 1), board_mino_size - 6)
      .css("background", climb_speed_colours[this.climb_speed] ?? "whitesmoke")
      climb_progress_display.append(progress_bar)
      let level_display = tag().html("LEVEL " + this.climb_speed).css("color","white").css("margin-top",3)

      bottom.append(altitude_display,floor_display,climb_progress_display,level_display)

      $("#background").css("top",-6235+
         Math.max(0, Math.min((this.altitude - this.ruleset.floor_tresholds[1]) / (this.ruleset.floor_tresholds[2] - this.ruleset.floor_tresholds[1]), 1)) * 200 + 
         Math.max(0, Math.min((this.altitude - this.ruleset.floor_tresholds[2]) / (this.ruleset.floor_tresholds[3] - this.ruleset.floor_tresholds[2]), 1)) * 300 + 
         Math.max(0, Math.min((this.altitude - this.ruleset.floor_tresholds[3]) / (this.ruleset.floor_tresholds[4] - this.ruleset.floor_tresholds[3]), 1)) * 480 + 
         Math.max(0, Math.min((this.altitude - this.ruleset.floor_tresholds[4]) / (this.ruleset.floor_tresholds[5] - this.ruleset.floor_tresholds[4]), 1)) * 480 + 
         Math.max(0, Math.min((this.altitude - this.ruleset.floor_tresholds[5]) / (this.ruleset.floor_tresholds[6] - this.ruleset.floor_tresholds[5]), 1)) * 575 + 
         Math.max(0, Math.min((this.altitude - this.ruleset.floor_tresholds[6]) / (this.ruleset.floor_tresholds[7] - this.ruleset.floor_tresholds[6]), 1)) * 600 + 
         Math.max(0, Math.min((this.altitude - this.ruleset.floor_tresholds[7]) / (this.ruleset.floor_tresholds[8] - this.ruleset.floor_tresholds[7]), 1)) * 750 + 
         Math.max(0, Math.min((this.altitude - this.ruleset.floor_tresholds[8]) / (this.ruleset.floor_tresholds[9] - this.ruleset.floor_tresholds[8]), 1)) * 800 + 
         Math.max(0, Math.min((this.altitude - this.ruleset.floor_tresholds[9]) / (this.ruleset.floor_tresholds[10] - this.ruleset.floor_tresholds[9]), (this.floor <= 9)? 0.87 : 1 )) * 800 + 
         Math.max(0, Math.min((this.altitude - this.ruleset.floor_tresholds[10]) / 1350, 1)) * 1250 + "vh"
      )
      $("#flash").css("opacity", Math.pow(Math.max(0, (this.floor < 10)? (this.altitude - ((this.ruleset.floor_tresholds[10] - this.ruleset.floor_tresholds[9]) * 0.87 + this.ruleset.floor_tresholds[9])) / (this.ruleset.floor_tresholds[10] - this.ruleset.floor_tresholds[9]) / 0.12
      : 1 - 0.25 * (this.altitude-this.ruleset.floor_tresholds[10])), 0.6))

      div.append(top_text, top, bottom)
      this.execute_mod_functions("render", {left, center, right, bottom, scalar})
   }
   update_game_state(){
      let delta = (Date.now() - this.time_of_last_update) / 1000
      this.time_of_last_update = Date.now()
      this.time += delta
      let temp_alt = this.altitude
      this.altitude += delta * this.climb_speed * 0.25 * this.ruleset.altitude_mult * this.ruleset.passive_altitude_gain * (this.ruleset.floor_barriers? Math.min(Math.pow((Math.max(0, this.ruleset.floor_tresholds[this.floor+1] - this.altitude - 1)) / 6, 0.75), 1) : 1)
      if(temp_alt < this.ruleset.floor_tresholds[this.floor+1] - 1 && this.ruleset.floor_barriers && this.altitude > this.ruleset.floor_tresholds[this.floor+1] - 1) this.altitude = this.ruleset.floor_tresholds[this.floor+1] - 1
      if(this.bonus_altitude > 0){
         let alt_moved = Math.min(this.bonus_altitude, Math.pow(0.92, 1/(delta + 0.01)) * Math.max(this.bonus_altitude, 0.1))
         this.bonus_altitude -= alt_moved
         this.altitude += alt_moved
      }
      if(this.altitude > this.ruleset.floor_tresholds[this.floor+1]){this.new_region; this.new_floor()}
      if(this.altitude > this.current_region_threshold){
         this.new_region()
         if(this.ruleset.shorter_region_tresholds.length > 0) this.current_region_threshold = this.ruleset.shorter_region_tresholds.shift()
         else this.current_region_threshold += this.ruleset.other_region_interval
      }
      if(this.altitude > this.windup_power_increase_altitude){
         this.ruleset.windup_maximum_attack += this.ruleset.windup_power_increase_amount
         this.windup_power_increase_altitude += this.ruleset.windup_power_increase_interval
      }
      if(this.climb_xp_lock_remaining <= 0) this.climb_xp -= delta * this.ruleset.climb_xp_loss_factor * (this.climb_speed * this.climb_speed + this.climb_speed) / 60
      else this.climb_xp_lock_remaining -= delta
      if(this.climb_xp < 0){
         if(this.climb_speed > 1){
            this.climb_speed -= 1
            this.climb_xp += 4 * this.climb_speed
         }
         else this.climb_xp = 0
         this.lock_csp = this.climb_speed + 1
      }
      if(this.climb_xp > this.climb_speed * 4){
         this.climb_xp -= 4 * this.climb_speed
         this.climb_speed += 1
         this.climb_speed += parseInt(this.climb_xp / this.climb_speed / 4)
         this.climb_xp_lock_remaining = this.lock_time
         this.lock_time = Math.max(this.lock_time - 1, 1)
         this.lock_csp = this.climb_speed
         this.highest_climb_speed = Math.max(this.highest_climb_speed, this.climb_speed)
      }
      if(this.climb_speed == this.lock_csp && this.climb_xp > this.climb_speed * 2) this.lock_time = 5

      this.garbage_queue.forEach(chunk => chunk.time_in_queue += delta * (this.cancelling_sickness > this.ruleset.cancelling_sickness_tresholds.less_garbage_delay? 2 : 1))
      this.stars.forEach(star => star.current_lifetime += delta)
      this.stars = this.stars.filter(star => star.current_lifetime < star.travel_time + 0.7 && (!star.defensive || star.current_lifetime < star.travel_time + 0.4))
      this.clear_whites.forEach(white => white.time += delta)
      this.clear_whites = this.clear_whites.filter(white => white.time < white.end_time + 0.1)

      if(this.windups.length > 0){
         if(!Array.isArray(this.windups[0].chunks)){
            let size = this.windups[0].chunks
            this.windups[0].chunks = []
            for(let i = 0; i < 4; i++){
               let moved = Math.min(Math.floor((this.ruleset.windup_maximum_attack + i) / 4), size)
               if(moved > 0){
                  size -= moved
                  this.windups[0].chunks.push(moved)
               }
            }
            this.windups[0].chunk_amount = this.windups[0].chunks.length
         }
         this.windups[0].time += delta
         if(this.windups[0].time > 1 + 0.5 * (this.windups[0].chunk_amount - this.windups[0].chunks.length) && this.windups[0].chunks.length > 0){
            this.garbage_queue.push({size: this.windups[0].chunks.shift(), time_in_queue: 0})
         }
         if(this.windups[0].time > 2 + 0.5 * this.windups[0].chunk_amount) this.windups.shift()
      }
      if(this.top_text.length > 0 && Date.now() - this.last_top_text_update - this.top_text[0].time * 1000 > 500){
         this.top_text.shift()
         this.last_top_text_update = Date.now()
      }

      let keys_just_pressed = [...keys_pressed].filter(key => !(this.last_update_keys_pressed.includes(key)))
      this.last_update_keys_pressed = [...keys_pressed]
      
      let inputs = []
      Object.keys(settings.controls).forEach(input => {
         let key = settings.controls[input] //settings.controls[input].forEach(key => {
         if(keys_just_pressed.includes(key)){
            inputs = inputs.filter(element => element != input)
            inputs.push(input)
         }
         else if((input == "left" || input == "right" || input == "soft_drop") && keys_pressed.includes(key)){
            inputs = inputs.filter(element => element != input + "held")
            inputs.push(input + "held")
         }
         //})
      })
      if(inputs.includes("hold")){
         inputs = ["hold"]
         if(this.hold_cooldown == 0 && !this.piece_placed){
            while(this.piece_rotation != 0){
               this.piece_rotation = (this.piece_rotation + 1) % 4
               this.controlled_piece.tile_positions.forEach((position, index) => {
                  this.controlled_piece.tile_positions[index] = new vector(position.y, -position.x)
                  if(!this.controlled_piece.center_is_in_a_middle_of_a_tile) this.controlled_piece.tile_positions[index].y -= 1
               })
            }
            this.hold_cooldown = this.ruleset.hold_cooldown
            this.holds++
            if(!this.hold){
               this.hold = this.controlled_piece
               this.spawn_piece()
            }
            else {
               let temp = this.hold
               this.hold = this.controlled_piece
               this.spawn_piece(temp)
            }
         }
      }

      this.piece_position.y -= 1
      if(this.piece_obstructed()) this.lock_delay -= delta * 0.5
      this.piece_position.y += 1

      if((inputs.includes("hard_drop") || this.lock_delay < 0) && !this.piece_placed){
         inputs = ["hard_drop"]
         while(!(this.piece_obstructed())){
            this.piece_position.y -= 1
         }
         this.piece_position.y += 1
         this.place_piece()
      }

      this.piece_partial_movement += delta * (this.ruleset.gravity + this.ruleset.gravity_increase * this.time)
      if(inputs.includes("soft_dropheld")){
         this.piece_partial_movement += delta * settings.handling.SDF
      }
      while(this.piece_partial_movement >= 1){
         this.piece_position.y -= 1
         this.piece_partial_movement -= 1
         if(this.piece_obstructed()){
            this.piece_position.y += 1
            this.piece_partial_movement = 0
         }
         else this.piece_spinnin = 0
      }

      let old_direction = this.piece_direction
      if(inputs.includes("left")) this.piece_direction = -1
      else if(inputs.includes("right")) this.piece_direction = 1
      else if(inputs.includes("leftheld") && !inputs.includes("rightheld")) this.piece_direction = -1
      else if(inputs.includes("rightheld") && !inputs.includes("leftheld")) this.piece_direction = 1
      if(this.piece_direction != old_direction) this.piece_as_time = 0
      
      if(inputs.includes("leftheld") || inputs.includes("rightheld")) this.piece_as_time += delta
      else if(!inputs.includes("hard_drop") && !inputs.includes("hold")) this.piece_as_time = 0
      while(this.piece_as_time >= settings.handling.DAS || inputs.includes("left") || inputs.includes("right")){
         inputs = inputs.filter(input => !(["right","left"].includes(input)))
         this.piece_as_time = Math.max(this.piece_as_time - settings.handling.ARR, 0)
         this.piece_position.x += this.piece_direction
         if(this.piece_obstructed()){
            this.piece_position.x -= this.piece_direction
            this.piece_as_time = settings.handling.DAS - settings.handling.ARR - 0.0001
         }
         else {
            this.reset_lock_delay()
            this.piece_spinnin = 0
         }
      }

      if(inputs.includes("rot_cw")){
         this.piece_rotation = (this.piece_rotation + 1) % 4
         this.controlled_piece.tile_positions.forEach((position, index) => {
            this.controlled_piece.tile_positions[index] = new vector(position.y, -position.x)
            if(!this.controlled_piece.center_is_in_a_middle_of_a_tile) this.controlled_piece.tile_positions[index].y -= 1
         })
         let kick = this.rotation_check([9,0,4,8][this.piece_rotation])
         if(kick === undefined) {
            this.piece_rotation = (this.piece_rotation + 3) % 4
            this.controlled_piece.tile_positions.forEach((position, index) => {
               this.controlled_piece.tile_positions[index] = new vector(-position.y, position.x)
               if(!this.controlled_piece.center_is_in_a_middle_of_a_tile) this.controlled_piece.tile_positions[index].x -= 1
            })
         }
         else {this.piece_position = this.piece_position.add(kick); this.reset_lock_delay(); this.piece_spinnin = 1}
      }
      
      if(inputs.includes("rot_180")){
         this.piece_rotation = (this.piece_rotation + 2) % 4
         this.controlled_piece.tile_positions.forEach((position, index) => {
            this.controlled_piece.tile_positions[index] = position.scale(-1)
            if(!this.controlled_piece.center_is_in_a_middle_of_a_tile) {this.controlled_piece.tile_positions[index].y -= 1; this.controlled_piece.tile_positions[index].x -= 1}
         })
         let kick = this.rotation_check([6,10,1,5][this.piece_rotation])
         if(kick === undefined) {
            this.piece_rotation = (this.piece_rotation + 2) % 4
            this.controlled_piece.tile_positions.forEach((position, index) => {
               this.controlled_piece.tile_positions[index] = position.scale(-1)
               if(!this.controlled_piece.center_is_in_a_middle_of_a_tile) {this.controlled_piece.tile_positions[index].y -= 1; this.controlled_piece.tile_positions[index].x -= 1}
            })
         }
         else {this.piece_position = this.piece_position.add(kick); this.reset_lock_delay(); this.piece_spinnin = 1}
      }

      if(inputs.includes("rot_ccw")){
         this.piece_rotation = (this.piece_rotation + 3) % 4
         this.controlled_piece.tile_positions.forEach((position, index) => {
            this.controlled_piece.tile_positions[index] = new vector(-position.y, position.x)
            if(!this.controlled_piece.center_is_in_a_middle_of_a_tile) this.controlled_piece.tile_positions[index].x -= 1
         })
         let kick = this.rotation_check([3,7,11,2][this.piece_rotation])
         if(kick === undefined) {
            this.piece_rotation = (this.piece_rotation + 1) % 4
            this.controlled_piece.tile_positions.forEach((position, index) => {
               this.controlled_piece.tile_positions[index] = new vector(position.y, -position.x)
               if(!this.controlled_piece.center_is_in_a_middle_of_a_tile) this.controlled_piece.tile_positions[index].y -= 1
            })
         }
         else {this.piece_position = this.piece_position.add(kick); this.reset_lock_delay(); this.piece_spinnin = 1}
      }

      if(this.piece_spinnin){
         let detection_pass = 0
         
         if (this.controlled_piece.spin_detection == "stupid") detection_pass = 2
            
         if (this.controlled_piece.spin_detection == "immobility" || this.controlled_piece.spin_detection == "weirdplus"){
            detection_pass = 2;
            [new vector(-1,0),new vector(1,0),new vector(0,1),new vector(0,-1)].forEach(trial => {
               this.piece_position = this.piece_position.add(trial)
               if (!this.piece_obstructed()) detection_pass = 0
               this.piece_position = this.piece_position.add(trial.scale(-1))
            })
            if (this.controlled_piece.spin_detection == "weirdplus" && detection_pass) detection_pass = 1
         }
         if (this.controlled_piece.spin_detection == "weird" || this.controlled_piece.spin_detection == "weirdplus"){
            let radius = 0
            this.controlled_piece.tile_positions.forEach(tile => {
               radius = Math.max(radius, Math.abs(tile.y) + (!this.controlled_piece.center_is_in_a_middle_of_a_tile && tile.y <= 0)? 1 : 0, Math.abs(tile.x) + (!this.controlled_piece.center_is_in_a_middle_of_a_tile && tile.x >= 0)? 1 : 0)
            })
            let corners = [
               new vector(radius - ((this.controlled_piece.center_is_in_a_middle_of_a_tile)? 0 : 1), radius),
               new vector(-1*radius, radius),
               new vector(radius - ((this.controlled_piece.center_is_in_a_middle_of_a_tile)? 0 : 1), -1*radius + ((this.controlled_piece.center_is_in_a_middle_of_a_tile)? 0 : 1)),
               new vector(-1*radius, -1*radius + ((this.controlled_piece.center_is_in_a_middle_of_a_tile)? 0 : 1))
            ]
            for(let i = 0; i < 4; i++){
               this.controlled_piece.tile_positions.forEach(tile => {
                  if(tile == corners[i]){
                     corners[i] += new vector(parseInt(i in [0,2]), parseInt(i in [0,1])) * 2 - new vector(1,1)
                  }
               })
            }
            let corners_obstructed = []
            corners.forEach(corner => {
               if (this.piece_position.x + corner.x < 0 || this.piece_position.x + corner.x > this.current_board_dimensions.x - 1 || this.piece_position.y + corner.y < 0 || this.piece_position.y + corner.y > this.current_board_dimensions.y + 20 - 1)
                  corners_obstructed.push(true)
               else if(this.board[this.piece_position.y + corner.y][this.piece_position.x + corner.x].type != 0)
                  corners_obstructed.push(true)
               else
                  corners_obstructed.push(false)
            })
            if (!detection_pass && corners_obstructed.filter(obstructed => obstructed).length >= 3) detection_pass = 1
            if (detection_pass == 1) if (this.piece_hyperkick || corners_obstructed[[0,0,2,1][this.piece_rotation]] && corners_obstructed[[1,2,3,3][this.piece_rotation]]) detection_pass = 2
         }
         this.piece_spinnin = detection_pass
      }

      let temp = deepClone(this.piece_position)
      while(!this.piece_obstructed()) this.piece_position.y -= 1
      this.ghost_piece_offset = temp.y - this.piece_position.y - 1
      this.piece_position = temp

      while(this.entering_garbage.length > 0 && Date.now() - this.last_garbage_entry > this.ruleset.garbage_entering_time * 1000){
         this.last_garbage_entry += this.ruleset.garbage_entering_time * 1000
         this.inject_garbage(this.entering_garbage.shift())
      }

      if(Date.now() - this.cancelling_sickness_last_reduced >= 30000){
         this.cancelling_sickness += 5 * this.ruleset.cancelling_sickness_gain_mult
         this.cancelling_sickness_last_reduced = Date.now()
      }
      this.garbage_received_boosts.cancelling_sickness = Math.min((this.floor > 7) ? (this.floor + 3) : Infinity, this.ruleset.cancelling_sickness_garbage_received_penalty_coefficient * this.cancelling_sickness * this.cancelling_sickness)

      if(this.targeting_grace == 0) this.targeting_grace_last_released = Date.now()
      else if(Date.now() - this.targeting_grace_last_released > this.ruleset.targeting_grace_release_time[this.floor-1] * 1000){
         this.targeting_grace--
         this.targeting_grace_last_released = Date.now()
      }

      this.ruleset.fatigue.forEach((fatigue, index) => {
         if(this.time > fatigue.time){
            if(fatigue.description.length > 0) this.add_top_text(fatigue.description, 5.5)
            fatigue.effect(this)
            this.ruleset.fatigue.splice(index, 1)
         }
      })

      this.piece_position.y -= 1
      if(this.piece_obstructed()) this.lock_delay -= delta * 0.5
      this.piece_position.y += 1
      this.execute_mod_functions("tick",{delta})
      this.render($("#board"))
   }
   add_top_text(text, time){
      this.top_text.push({text, time})
      if(this.top_text.length == 1) this.last_top_text_update = Date.now()
   }
   get_piece(name){
      return deepClone(this.ruleset.available_pieces.find(piece => piece.name == name))
   }
   spawn_piece(piece = undefined){
      let result = this.execute_mod_functions("piece_spawn", {piece})
      piece = result.piece
      if(!piece){
         this.controlled_piece = this.queue.shift()
         if(this.queue.length < this.ruleset.queue_size + 1) {
            this.queue.push(this.get_piece(this.bag.pop()))
            if(this.bag.length <= this.ruleset.bag_refresh_at) {
               this.bag = [...this.ruleset.bag]
               this.bag.sort(() => 0.5 - Math.random())
               let extra_bag = []
               if(this.cancelling_sickness >= this.ruleset.cancelling_sickness_tresholds.o) extra_bag.push("O")
               if(this.cancelling_sickness >= this.ruleset.cancelling_sickness_tresholds.sz) extra_bag.push((Math.random() < 0.5)? "S" : "Z")
               if(this.cancelling_sickness >= this.ruleset.cancelling_sickness_tresholds.sz2) extra_bag.push((Math.random() < 0.5)? "S" : "Z")
               if(this.cancelling_sickness >= this.ruleset.cancelling_sickness_tresholds.ti) extra_bag.push((Math.random() < 0.5)? "T" : "I")
               if(this.cancelling_sickness >= this.ruleset.cancelling_sickness_tresholds.lj) extra_bag.push((Math.random() < 0.5)? "L" : "J")
               if(this.cancelling_sickness >= this.ruleset.cancelling_sickness_tresholds.lj2) extra_bag.push((Math.random() < 0.5)? "L" : "J")
               extra_bag.sort(() => 0.5 - Math.random())
               this.bag = this.bag.concat(extra_bag)
            }
         }
         if(this.cancelling_sickness > this.ruleset.cancelling_sickness_tresholds.i5 && !this.cancelling_sickness_i5_received) {
            this.queue.push(this.get_piece("I5"))
            this.cancelling_sickness_i5_received = true
         }
      }
      else this.controlled_piece = piece
      this.piece_position = new vector(Math.ceil(this.current_board_dimensions.x/2)-1,this.current_board_dimensions.y + 1).add(this.controlled_piece.position_offset)
      if(!this.controlled_piece.center_is_in_a_middle_of_a_tile) this.piece_position.x += 1
      this.piece_rotation = 0
      this.piece_placed = false
      this.lock_delay = this.ruleset.lock_delay
      this.lock_delay_resets = this.ruleset.lock_delay_resets
      if(this.piece_obstructed()){
         if(this.clutch){
            for(let i = 0; i < 15 && this.piece_obstructed(); i++) this.piece_position.y++
            if(this.piece_obstructed()) death(this)
         }
         else death(this)
      }
   }
   reset_lock_delay(){
      if(this.lock_delay != this.ruleset.lock_delay && this.lock_delay_resets > 0){
         this.lock_delay_resets -= 1
         this.lock_delay = this.ruleset.lock_delay
      }
   }
   place_piece(){
      this.controlled_piece.tile_positions.forEach((mino, index) => {
         this.board[mino.y + this.piece_position.y][mino.x + this.piece_position.x] = this.controlled_piece.tile_type[index]
      })
      this.pieces_placed += 1
      if(this.hold_cooldown > 0) this.hold_cooldown -= 1

      let lines_cleared = 0
      let cleared_indexes = []
      let garbage_cleared = 0
      let attacks = 0
      let pc = 0
      this.board.forEach((row, yindex) => {
         let flag = !row.find(cell => cell.type == 0 || cell.type > 2)
         if(flag){
            lines_cleared++
            cleared_indexes.push(yindex)
            if(row.find(cell => cell.type == 2)) garbage_cleared++
            row.forEach((cell, xindex) => {this.board[yindex][xindex] = new tile(0)})
         }
      })
      if(lines_cleared){
         this.total_lines_cleared += lines_cleared
         this.garbage_lines_cleared += garbage_cleared
         this.clutch = true
         this.combo += 1
         if(this.controlled_piece.name == "I5" && this.ruleset.cancelling_sickness_downgrade_pentas_from_special_piece && lines_cleared > 4) lines_cleared--
         this.action_text = (this.piece_spinnin == 1? "mini ":"") + (this.piece_spinnin? this.controlled_piece.name + "-SPIN ":"") + clear_names[Math.min(lines_cleared-1, 19)].toUpperCase("")
         this.last_action_text_update = Date.now()
         if(this.piece_spinnin == 2){
            attacks = this.controlled_piece.override_attack_table.spin ?? this.ruleset.attack_table.spin
         }
         else{
            attacks = this.controlled_piece.override_attack_table.normal ?? this.ruleset.attack_table.normal
         }
         attacks = attacks[lines_cleared]
         pc = 2
         this.board.forEach(row => {
            row.forEach(cell => {
               if(cell.type == 1) pc = 0
               if(pc == 2 && [2,5].includes(cell.type)) pc = 1
            })
         })
         if(this.piece_spinnin || lines_cleared >= 4 || (pc == 2 && this.ruleset.pc_btb) || (pc == 1 && this.ruleset.cc_btb)){
            this.btb += 1
            this.ruleset.btb_chaining_thresholds.forEach(treshold => {
               if(this.btb >= treshold) attacks++
            })
            if(this.btb >= this.ruleset.btb_charging_starting_btb) this.powah = this.ruleset.btb_charging_starting_surge + (this.btb - this.ruleset.btb_charging_starting_btb) * this.ruleset.btb_charging_surge_per_btb
         }
         else {this.btb = -1}
         attacks *= 1 + this.combo * this.ruleset.combo_multiplier
         if(attacks == 0){
            if(this.combo == 0 && this.btb == -1 && this.ruleset.naked_single_sends) attacks = 1
            if(this.combo >= 2) attacks = Math.log(1 + 1.25 * this.combo)
         }
         if(pc == 2){
            this.cancelling_sickness += 3 * this.ruleset.cancelling_sickness_gain_mult
            attacks += this.ruleset.pc_attacks
            this.btb += Math.max(this.ruleset.pc_btb - 1, 0)
            if(this.ruleset.pc_attacks) {
               this.pc_text = "ALL\nCLEAR"
               this.last_pc_text_update = Date.now()
            }
            this.all_clears++
         }
         else if(pc == 1){
            attacks += this.ruleset.cc_attacks
            this.btb += Math.max(this.ruleset.cc_btb - 1, 0)
            if(this.ruleset.cc_attacks) {
               this.pc_text = "COLOUR\nCLEAR"
               this.last_pc_text_update = Date.now()
            }
         }
         this.highest_btb = Math.max(this.highest_btb, this.btb)
         this.highest_combo = Math.max(this.highest_combo, this.combo)
         this.board.forEach(row => row.forEach(cell => {
            if(cell.type == 4){cell.subtype.counter--}
         }))
      }
      else {
         if(this.piece_spinnin){
            this.action_text = (this.piece_spinnin == 1? "mini ":"") + this.controlled_piece.name + "-SPIN "
            this.last_action_text_update = Date.now()
         }
         this.combo = -1
         this.clutch = false
         for(let i = 0; i < this.ruleset.garbage_cap && this.garbage_queue.length > 0; i++){
            if(this.garbage_queue[0].time_in_queue >= this.ruleset.garbage_entry_delay[this.floor-1]){
               if(this.entering_garbage.length == 0) this.last_garbage_entry = Date.now()
               this.entering_garbage.push(this.chunk_started)
               this.garbage_queue[0].size--
               if(this.garbage_queue[0].size == 0){
                  this.garbage_queue.shift()
                  this.chunk_started = false
               }
               else this.chunk_started = true
               this.reduce_cancelling_sickness(3)
               if(this.separate_garbage[0] > 0){
                  this.separate_garbage[0]--
                  this.separate_garbage[1]++
               }
               if(this.ruleset.instant_garbage_entry) this.inject_garbage(this.entering_garbage.shift())
            }
         }
      }

      this.cancelling_sickness_pieces_since_reduced++
      if(this.cancelling_sickness_pieces_since_reduced >= 75){
         this.cancelling_sickness += 5 * this.ruleset.cancelling_sickness_gain_mult
         this.cancelling_sickness_pieces_since_reduced = 0
      }
      if(["S","Z"].includes(this.controlled_piece.name) && this.piece_spinnin > 0){
         this.cancelling_sickness_last_sz_spins.push(this.controlled_piece.name)
         let diff = 0
         if(this.cancelling_sickness_last_sz_spins.length >= 5){
            this.cancelling_sickness_last_sz_spins.forEach(name => {
               if(name == "S") diff++
               else diff--
            })
            if(diff >= 4) this.cancelling_sickness += 2 * this.ruleset.cancelling_sickness_gain_mult
            if(this.cancelling_sickness_last_sz_spins.length > 5) this.cancelling_sickness_last_sz_spins.shift()
         }
      }
      if(this.controlled_piece.name == "I" && [1,3].includes(this.piece_rotation) && lines_cleared == 0){
         let column
         if([0,this.current_board_dimensions.x-2].includes(this.piece_position.x)) column = this.piece_position.x + 1
         if([1,this.current_board_dimensions.x-1].includes(this.piece_position.x)) column = this.piece_position.x - 1
         if(column || column === 0){
            let flag = true
            this.controlled_piece.tile_positions.forEach(position => {
               if(!(this.board[position.y + this.piece_position.y][column].type == 1 && this.board[position.y + this.piece_position.y][column].subtype == 1)) flag = false
            })
            if(flag) this.cancelling_sickness += 3 * this.ruleset.cancelling_sickness_gain_mult
         }
      }
      if(lines_cleared >= 4){
         if(this.cancelling_sickness_last_quad_columns.includes(this.piece_position.x) || this.cancelling_sickness_last_quad_columns.length < 2) this.reduce_cancelling_sickness(3)
         else this.reduce_cancelling_sickness(7)
         this.cancelling_sickness_last_quad_columns.push(this.piece_position.x)
         if(this.cancelling_sickness_last_quad_columns.length > 2) this.cancelling_sickness_last_quad_columns.shift()
      }
      if(this.controlled_piece.name == "I" && this.piece_spinnin > 0 && lines_cleared > 0) this.reduce_cancelling_sickness(2)
      if(garbage_cleared > 0) this.reduce_cancelling_sickness(this.cancelling_sickness)

      let dropped = false
      if(this.btb == -1 && this.powah > 0) {
         this.create_attacks(this.powah, "starsurge")
         this.powah = 0
         dropped = true
      }

      let result = this.execute_mod_functions("placed",{dropped, lines_cleared, garbage_cleared, cleared_indexes, attacks, pc})

      this.create_attacks(result.attacks)
      if(result.lines_cleared && this.ruleset.climb_xp_gain_methods.clear) this.climb_xp += (Math.min(result.lines_cleared, 2) + 0.05) * this.ruleset.climb_xp_gain_mult

      if(this.altitude > this.ruleset.floor_tresholds[this.floor+1] - 2 && this.ruleset.floor_barriers){
         if(result.lines_cleared > 0 && this.ruleset.barrier_skip_actions.includes("line_clear")) this.new_floor()
      }

      this.board.forEach(row => {
         let flag = false
         row.forEach(cell => {
            if(cell.type == 4){if(cell.subtype.counter == 0){cell.type = cell.subtype.post[0]; cell.subtype = cell.subtype.post[1] ?? 0; flag = true}}
         })
         if(flag) this.garbage_entry_row -= 1
      })
      this.piece_placed = true

      let wait_time = (lines_cleared > 0)? this.ruleset.lc_are : 0


      result.cleared_indexes.forEach((yindex, index_index) => {
         this.board[yindex].forEach((cell, xindex) => {
            if(wait_time <= 0.7 && wait_time > 0.25) this.clear_whites.push({position: new vector(xindex,yindex), animation: 0, time: 0, end_time: wait_time - 0.15})
            if(wait_time > 0.7) this.clear_whites.push({position: new vector(xindex,yindex), animation: 1, time: (-xindex/* - (cleared_indexes.length - 1 - index_index) / 2*/) * (wait_time - 0.2) * (2/3) / (this.current_board_dimensions.x - 1/* + (lines_cleared - 1) / 2*/), end_time: (wait_time - 0.2) / 3})
         })
      })

      if(wait_time > 0) window.setTimeout(() => this.update_clears_and_continue(cleared_indexes), wait_time * 1000)
      else this.update_clears_and_continue(cleared_indexes)
      
   }
   update_clears_and_continue(cleared_indexes){
      if(cleared_indexes.length > 0){
            let amount = 0
            this.board.forEach((row, yindex) => {
               if(!cleared_indexes.includes(yindex)) row.forEach((cell, xindex) => {
                  this.board[yindex][xindex] = new tile(0)
                  this.board[yindex - amount][xindex] = cell
               })
               else amount++
            })
         }
      this.spawn_piece()
   }
   create_attacks(amount, type = "normal"){
      let result = this.execute_mod_functions("attack", {amount, type})
      amount = result.amount
      let orgin = new vector(this.piece_position.x / this.current_board_dimensions.y * 20 * board_mino_size, (this.current_board_dimensions.y - this.piece_position.y) / this.current_board_dimensions.y * 20 * board_mino_size - 0.5 * board_mino_size)
      if(type == "starsurge") orgin = new vector(-80, 150)

      amount *= this.ruleset.attack_mult
      if((Math.random() < amount - parseInt(amount) && this.ruleset.rounding == "rng") || this.ruleset.rounding == "up" && amount != parseInt(amount)) amount += 1
      amount = parseInt(amount)
      this.attacks_created += amount
      let cancelled = 0
      let cancel_mult = this.ruleset.cancelling_mult
      let total_attacks_in_queue = this.garbage_queue.reduce((sum, chunk) => sum += chunk.size, 0)
      if(amount * cancel_mult > total_attacks_in_queue){
         this.garbage_queue = []
         amount -= total_attacks_in_queue
         if(amount < 0) amount = 0
         cancelled += total_attacks_in_queue
      }
      else { 
         while(amount > 0 && this.garbage_queue.length > 0){
            if(amount * cancel_mult > 1 || amount * cancel_mult > Math.random()){
               amount -= 1 / cancel_mult
               this.garbage_queue[this.garbage_queue.length-1].size--
               this.garbage_queue = this.garbage_queue.filter(chunk => chunk.size > 0)
               cancelled++
            }
            else amount = 0
         }
         amount = 0
      }
      if(cancelled) {
         this.attacks_cancelled += cancelled
         if(this.ruleset.climb_xp_gain_methods.block) this.climb_xp += (cancelled * 0.5 + 0.05) * this.ruleset.climb_xp_gain_mult
         for(let i = 0; i < cancelled; i++){
            this.stars.push(new attack_star(orgin, 0, 1, true, new vector(-20, (this.current_board_dimensions.y - total_attacks_in_queue + i) / this.current_board_dimensions.y * 20 * board_mino_size)))
         }
         this.separate_garbage[0] -= cancelled
         if(this.separate_garbage[0] < 0) this.separate_garbage[0] = 0
      }
      if(amount) {
         let stars = [amount, 0, 0]
         let treshold = 15
         if(type == "starsurge") treshold = 40
         while(stars[0] + stars[1] >= treshold && stars[0] >= 10){
            stars[0] -= 10
            stars[1]++
         }
         while(stars[1] + stars[2] >= treshold && stars[1] >= 10){
            stars[1] -= 10
            stars[2]++
         }
         while(stars[stars.length-1] == 0) stars.pop()
         while(stars.length > 0) {
            this.stars.push(new attack_star(orgin, Math.min(400, Math.cbrt(amount) * 30), stars.length))
            stars[stars.length-1]--
            while(stars[stars.length-1] == 0) stars.pop()
         }
         if(this.ruleset.climb_xp_gain_methods.send) this.climb_xp += (amount + 0.05) * this.ruleset.climb_xp_gain_mult
         this.attacks_sent += amount
         send_attacks(this, amount)
      }

      if(this.altitude > this.ruleset.floor_tresholds[this.floor+1] - 2 && this.ruleset.floor_barriers){
         if((amount > 0) && this.ruleset.barrier_skip_actions.includes("garbage_send")) this.new_floor()
         else if(cancelled > 0 && this.ruleset.barrier_skip_actions.includes("garbage_block")) this.new_floor()
      }

      this.bonus_altitude += amount * this.climb_speed / 4 * this.ruleset.altitude_mult
      this.cancelling_sickness += cancelled * this.ruleset.cancelling_sickness_gain_mult
   }
   piece_obstructed(){
      let flag = false
      this.controlled_piece.tile_positions.forEach(tile => {
         if(tile.y + this.piece_position.y < 0 || tile.x + this.piece_position.x < 0 || tile.y + this.piece_position.y >= this.current_board_dimensions.y + 20 || tile.x + this.piece_position.x >= this.current_board_dimensions.x) flag = true
         else if(this.board[tile.y + this.piece_position.y][tile.x + this.piece_position.x].type != 0) flag = true
      })
      return flag
   }
   rotation_check(rotation_table_id){
      return this.controlled_piece.kick_table[rotation_table_id].find(check => {
         this.piece_position = this.piece_position.add(check)
         let flag = this.piece_obstructed()
         if(!flag) this.piece_hyperkick = Math.max(Math.abs(check.x), Math.abs(check.y)) >= 2
         this.piece_position = this.piece_position.add(check.scale(-1))
         return !flag
      })
   }
   new_floor(){
      this.floor++
      this.bonus_altitude += this.ruleset.floor_cross_altitude * this.ruleset.altitude_mult
      this.ruleset.garbage_messiness += this.ruleset.garbage_messiness_per_floor
      this.ruleset.garbage_favour += this.ruleset.garbage_favour_per_floor
      this.execute_mod_functions("floor")
      this.execute_mod_functions("region")
   }
   new_region(){

   }
   inject_garbage(new_attack = true, messiness = this.ruleset.garbage_messiness, type = "normal", counter = 10, override_pattern = undefined){
      let pattern = override_pattern ?? this.current_garbage_pattern
      let garbage_entry_row = this.garbage_entry_row
      if(type == "wound"){
         while(garbage_entry_row > 0 && this.board[garbage_entry_row - 1][0].type == 4 && this.board[garbage_entry_row - 1][0].subtype.counter <= counter) garbage_entry_row--
      }
      let result = this.execute_mod_functions("garbage", {garbage_pattern: [...pattern]})
      for(let i = this.board.length - 1; i >= garbage_entry_row; i--){
         for(let j = 0; j < this.board[i].length; j++){
            if(this.board[i][j].type != 0){
               if(i == this.board.length - 1) death(this)
               else {
                  this.board[i + 1][j] = this.board[i][j]
                  this.board[i][j] = new tile(0)
               }
            }
         }
      }
      for(let i = 0; i < this.board[garbage_entry_row].length; i++){
         if(type == "perma") this.board[garbage_entry_row][i] = new tile(3)
         else if(result.garbage_pattern[i] == 0) this.board[garbage_entry_row][i] = type=="wound"? new tile(4, {counter, post:[0,0]}) : new tile(0)
         else if(result.garbage_pattern[i] == 1) this.board[garbage_entry_row][i] = type=="wound"? new tile(4, {counter, post:[2,0]}) : new tile(2)
      }
      if(type == "perma" || type == "wound") this.garbage_entry_row++
      if(this.piece_obstructed()) this.piece_position.y++

      messiness -= Math.min(1, this.targeting_grace / this.ruleset.targeting_grace_effective_max) * this.ruleset.targeting_grace_max_messiness_reduction
      if(new_attack) messiness *= 2.5
      if((Math.random() < messiness || this.current_garbage_pattern === undefined || this.separate_garbage[1] > 0) && !(type == "perma")){
         if(this.separate_garbage[1] > 0){
            let current_pattern = [...this.current_garbage_pattern]
            do {this.current_garbage_pattern = this.randomize_garbage_pattern(true)} while(this.current_garbage_pattern.filter((col, index) => col != current_pattern[index]).length == 0)
            this.separate_garbage[1]--
         }
         else this.current_garbage_pattern = this.randomize_garbage_pattern()
         this.execute_mod_functions("new_garbage_pattern")
      }
   }
   randomize_garbage_pattern(ignore_stuff = false){
      let columns = [{number: 0, difficulty: 0, weight: 0}]
      while(columns.length < this.current_board_dimensions.x) columns.push({number: columns[columns.length-1].number+1, difficulty: 0, weight: 0})
      columns = columns.filter(column => ignore_stuff || !this.ruleset.garbage_gathering || this.ruleset.garbage_messiness > this.ruleset.garbage_gathering_max_messiness || (column.number >= Math.min(2, Math.ceil((this.current_board_dimensions.x - 4)/2)) && column.number <= this.current_board_dimensions.x - 1 - Math.min(2, Math.floor((this.current_board_dimensions.x - 4)/2))))
      let highest_spot = 0
      let highest_garbage_holes = []
      let highest_garbage_row = -1
      let FINAL_COLUMNS = []
      this.board.forEach((row, yindex) => {
         let holes = []
         row.forEach((cell, xindex) => {
            if([1,2].includes(cell.type)) highest_spot = yindex 
            else holes.push(xindex)
            if(cell.type == 2) highest_garbage_row = yindex
         })
         if(yindex == highest_garbage_row) highest_garbage_holes = [...holes]
      })
      columns.forEach(column => {
         let hole
         for(let i = 0; i < this.current_board_dimensions.y + 20; i++){
            if([0,5].includes(this.board[i][column.number].type)){hole = i; break;}
         }
         column.difficulty += highest_spot - hole
         if(highest_garbage_holes){
            column.difficulty += 5 * Math.min(...highest_garbage_holes.map(xpos => Math.abs(xpos - column.number)))
         }
      })
      columns.sort(() => 0.5 - Math.random())
      columns.sort((a, b) => a.difficulty-b.difficulty)
      for(let i = 0; i < this.ruleset.garbage_well_amount; i++){
         let total_weight = 0
         columns.forEach((column, index) => {
            column.weight = Math.max(10 + ((ignore_stuff)? 0 : this.ruleset.garbage_favour) - index * ((ignore_stuff)? 0 : this.ruleset.garbage_favour) / 4.5, 0)
            total_weight += column.weight
         })
         let lottery_score = Math.random() * total_weight
         let index = -1
         do {
            index++
            lottery_score -= columns[index].weight
         } while(lottery_score > 0)
         FINAL_COLUMNS.push(columns[index].number)
         columns.splice(index, 1)
      }
      let new_garbage_pattern = []
      for(let i = 0; i < this.current_board_dimensions.x; i++) new_garbage_pattern.push(FINAL_COLUMNS.includes(i)? 0 : 1)
      let result = this.execute_mod_functions("garbage_pattern", {new_garbage_pattern})
      return result.new_garbage_pattern
   }
   manual_delayed_injection(amount, delay, type = "normal"){
      if(amount > 0){
         window.setTimeout(() => {
            this.inject_garbage(false, 0, type)
            this.manual_delayed_injection(amount-1, delay, type)
         }, delay * 1000)
      }
   }
   reduce_cancelling_sickness(amount){
      this.cancelling_sickness -= amount
      if(this.cancelling_sickness < 0) this.cancelling_sickness = 0
      this.cancelling_sickness_pieces_since_reduced = 0
      this.cancelling_sickness_last_reduced = Date.now()
   }
   execute_mod_functions(name, input = undefined){
      let function_table = this.mods.map(mod => mods[mod][name]).flat(1).filter(func => func)
      function_table.sort((a, b) => b.priority - a.priority)
      return function_table.reduce((inp, func) => func.effect(this, inp), input)
   }
   enable_hard_mode(){
      this.ruleset.naked_single_sends = false
      this.ruleset.targeting_reduction_in_danger = 0
   }
   remove_base_fatigue(){
      if(!this.base_fatigue_removed){
         [480,540,600,660,720].forEach(time => this.ruleset.fatigue.splice(this.ruleset.fatigue.findIndex(fatigue => fatigue.time == time), 1))
         this.base_fatigue_removed = true
      }
   }
   constructor(){
      this.reset_board()
      modblocks.forEach(block => {if(block.selected) this.mods.push(block[block.state])})
      this.mods.sort((a, b) => a - b)
      this.queue = []
      this.execute_mod_functions("start")
      this.current_garbage_pattern = this.randomize_garbage_pattern()
      this.execute_mod_functions("new_garbage_pattern")
      this.bag.sort(() => 0.5 - Math.random())
      while(this.queue.length < this.ruleset.queue_size + 3){
         this.queue.push(this.get_piece(this.bag.pop()))
         if(this.bag.length <= this.ruleset.bag_refresh_at){
            this.bag = [...this.ruleset.bag]
            this.bag.sort(() => 0.5 - Math.random())
         }
      }
      this.hold_cooldown = this.ruleset.hold_cooldown >= 0? 0 : -1
      $("body").css("overflow", "hidden")
      $("#board").css("display","flex").css("scale",1)
      $("#background").css("display","flex")
      $("#background").css("opacity",1)
      $("#menu").css("display","none")
      this.spawn_piece()
      this.update_timer = window.setInterval(() => {this.update_game_state()}, 17)
   }
}