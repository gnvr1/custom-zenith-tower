let mods = [
   {
      name: "no hold",
      start: {effect: (recipient, input) => {recipient.ruleset.hold_cooldown = -1}, priority: 0}
   },
   {
      name: "asceticism",
      extra_hole_side: ((Math.random > 0.5)? -1 : 1),
      start: {effect: (recipient, input) => {
         let this_mod = mods[1]
         this_mod.extra_hole_side = ((Math.random > 0.5)? -1 : 1)
         recipient.ruleset.hold_cooldown = -1
         recipient.ruleset.queue_size = 1
         recipient.ruleset.ghost_piece = false
         recipient.ruleset.bag_refresh_at = 6
         recipient.ruleset.available_pieces.find(piece => piece.name == "T").override_attack_table = {}
         recipient.ruleset.cancelling_sickness_gain_mult = 0
         recipient.ruleset.garbage_entry_delay = [2.5,2.5,2.5,2.5,2.5,2.5,2,1.5,1,0.5]
         recipient.enable_hard_mode()
      }, priority: 0},
      garbage: {effect: (recipient, input) => {
         let this_mod = mods[1]
         if(Math.random() < (recipient.floor + 1) * 0.05) this_mod.extra_hole_side *= -1
         let pattern = input.garbage_pattern.map((column, index) => column == 0? index : undefined).filter(column => column != undefined)
         if(pattern.filter(column => !pattern.includes(column + this_mod.extra_hole_side) && column + this_mod.extra_hole_side >= 0 && column + this_mod.extra_hole_side < recipient.current_board_dimensions.x).length == 0) this_mod.extra_hole_side *= -1
         pattern = pattern.filter(column => !pattern.includes(column + this_mod.extra_hole_side) && column + this_mod.extra_hole_side >= 0 && column + this_mod.extra_hole_side < recipient.current_board_dimensions.x)
         if(pattern.length > 0){
            pattern.sort(() => 0.5 - Math.random())
            input.garbage_pattern[pattern[0] + this_mod.extra_hole_side] = 0
         }
         return input
      }, priority: 0}
   },
   {
      name: "messier garbage",
      start: {effect: (recipient, input) => {
         recipient.ruleset.garbage_messiness += 0.25
         recipient.ruleset.fatigue.push({time: 360, effect: (player) => {player.ruleset.targeting_grace_max_messiness_reduction = 0}, description: ""})
         recipient.ruleset.garbage_favour -= 25
      }, priority: 0}
   },
   {
      name: "loaded dice",
      start: [{effect: (recipient, input) => {
         recipient.ruleset.garbage_messiness += 1
         recipient.ruleset.lc_are += 1.15
         recipient.ruleset.fatigue.push({time: 360, effect: (player) => {player.ruleset.targeting_grace_max_messiness_reduction = 0}, description: ""})
         recipient.ruleset.garbage_favour -= 25
         recipient.ruleset.garbage_line_protection_max_stacks = 5
         recipient.ruleset.garbage_entry_delay = [2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5]
         recipient.enable_hard_mode()
      }, priority: 0},
      {effect: (recipient, input) => {
         for(let i = 0; i < Math.min(12, recipient.current_board_dimensions.y - 2); i++){
            for(j = 0; j < Math.ceil(recipient.current_board_dimensions.x / 2); j++){
               if(([1,3].includes(i % 4) && j % 4 != 0) || (i % 4 == 2 && [1,3].includes(j % 4))){
                  recipient.board[i][Math.ceil(recipient.current_board_dimensions.x / 2)-1-j] = new tile(2)
                  if(Math.ceil(recipient.current_board_dimensions.x / 2) + j < recipient.current_board_dimensions.x)
                     recipient.board[i][Math.ceil(recipient.current_board_dimensions.x / 2)+j] = new tile(2)
               }
            }
         }
      }, priority: -1}],
   },
   {
      name: "gravity",
      target_gravity: 30,
      lock_delay_table: [0.5,0.5,0.48333,0.46666,0.45,0.43333,0.4,0.36666,0.33333,0.3,0.26666],
      start: {effect: (recipient, input) => {
         mods[4].target_gravity = 30
      }, priority: 0},
      tick: {effect: (recipient, input) => {
         let this_mod = mods[4]
         if(recipient.time > 1) recipient.ruleset.gravity += Math.min(this_mod.target_gravity - recipient.ruleset.gravity, 10) * input.delta
         return input
      }, priority: 0},
      floor: {effect: (recipient, input) => {
         let this_mod = mods[4]
         this_mod.target_gravity += 18
         recipient.ruleset.lock_delay = this_mod.lock_delay_table[recipient.floor]
      }, priority: 0}
   },
   {
      name: "freefall",
      target_gravity: 1200,
      lock_delay_table: [0.5,0.4,0.36666,0.33333,0.3,0.26666,0.25,0.23333,0.21666,0.2,0.18333],
      start: {effect: (recipient, input) => {
         recipient.ruleset.lock_delay = 0.4
         recipient.ruleset.garbage_entry_delay = [2.5,2.5,2.5,2.5,2.5,2.5,2,1.5,1,0.5]
         recipient.enable_hard_mode()
      }, priority: 0},
      tick: {effect: (recipient, input) => {
         let this_mod = mods[5]
         if(recipient.time > 1) recipient.ruleset.gravity += Math.min(this_mod.target_gravity - recipient.ruleset.gravity, recipient.ruleset.gravity * 1.2, 180) * input.delta
         return input
      }, priority: 0},
      floor: {effect: (recipient, input) => {
         let this_mod = mods[5]
         recipient.ruleset.lock_delay = this_mod.lock_delay_table[recipient.floor]
      }, priority: 0}
   },
   {
      name: "volatile garbage",
      start: {effect: (recipient, input) => {
         recipient.garbage_received_mults.voli = 2
         recipient.ruleset.windup_threshold *= 2
         recipient.ruleset.windup_maximum_attack *= 2
         recipient.ruleset.windup_power_increase_amount *= 2
         recipient.ruleset.cancelling_mult *= 2
         Object.keys(recipient.ruleset.cancelling_sickness_tresholds).forEach(treshold => {if(treshold != "i5") recipient.ruleset.cancelling_sickness_tresholds[treshold] *= 2}) 
      }, priority: 0}
   },
   {
      name: "last stand",
      next_garbage_pattern: [],
      start: [{effect: (recipient, input) => {
         recipient.garbage_received_mults.voli = 3
         recipient.ruleset.targeting_grace_mult = 0.334
         recipient.ruleset.windup_threshold *= 2
         recipient.ruleset.windup_maximum_attack *= 2
         recipient.ruleset.windup_power_increase_amount *= 2
         recipient.ruleset.garbage_entry_delay = [2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5]
         recipient.ruleset.board_dimension_mults.y = 0.7
         recipient.recalculate_board_dimensions()
         recipient.ruleset.garbage_gathering_max_messiness = 5
         recipient.enable_hard_mode()
      }, priority: 0}, {effect: (recipient, input) => {
         recipient.ruleset.garbage_favour = 50
         recipient.ruleset.garbage_favour_per_floor = 0
         recipient.current_garbage_pattern = recipient.randomize_garbage_pattern()
         recipient.execute_mod_functions("new_garbage_pattern")
      }, priority: -2},
      ],
      new_garbage_pattern: {effect: (recipient, input) => {
         let this_mod = mods[7]
         let pattern = recipient.current_garbage_pattern
         recipient.current_garbage_pattern = this_mod.next_garbage_pattern
         this_mod.next_garbage_pattern = pattern
      }, priority: -1},
      render: {effect: (recipient, input) => {
         let this_mod = mods[7]
         recipient.current_garbage_pattern.forEach((col, index) => {
            if(col == 0){
               let arrow = tag().html("&#x25B2;").css("position","absolute").css("top",recipient.current_board_dimensions.y * board_mino_size * input.scalar - 5)
               .css("left", board_mino_size * input.scalar * index).css("color","white").css("font-size",board_mino_size * input.scalar)
               input.center.append(arrow)
            }
         })
         this_mod.next_garbage_pattern.forEach((col, index) => {
            if(col == 0){
               let arrow = tag().html("&#x2227;").css("position","absolute").css("top",recipient.current_board_dimensions.y * board_mino_size * input.scalar + 5)
               .css("left", board_mino_size * input.scalar * (index + 0.2)).css("color","white").css("font-size",board_mino_size * input.scalar)
               input.center.append(arrow)
            }
         })
         return input
      }, priority: 0},
   },
   {
      name: "double hole garbage",
      garbage: {effect: (recipient, input) => {
         if(Math.random() < 0.5){
            let pattern = input.garbage_pattern.map((column, index) => column == 1? index : undefined).filter(column => column != undefined)
            input.garbage_pattern[pattern.sort(() => Math.random() - 0.5)[0]] = 0
         }
         return input
      }, priority: 0}
   },
   {
      name: "damnation",
      lower_variation: Math.random() < 0.5,
      blight: false,
      garbage_cleared: false,
      line_cleared: false,
      start: [{effect: (recipient, input) => {
         let this_mod = mods[9]
         this_mod.blight = false
         this_mod.lower_variation = Math.random() < 0.5
         recipient.ruleset.garbage_messiness += 21.37
         recipient.ruleset.garbage_well_amount = this_mod.lower_variation? 6 : 7 
         recipient.ruleset.garbage_line_protection_max_stacks = 5
         recipient.ruleset.available_pieces.forEach(piece => {if(piece.spin_detection == "immobility") piece.spin_detection = "none"})
         recipient.ruleset.garbage_entry_delay = [2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5]
         recipient.ruleset.garbage_cap = 2
         recipient.enable_hard_mode()
      }, priority: 0},
      {effect: (recipient, input) => {
         recipient.ruleset.garbage_favour_per_floor = 0
         recipient.ruleset.garbage_favour = 0
         for(let i = 0; i < Math.min(12, recipient.current_board_dimensions.y - 2); i++){
            for(j = (recipient.mods.includes(3)? Math.ceil(recipient.current_board_dimensions.x / 2) : 0); j < recipient.current_board_dimensions.x; j++){
               if((i + j) % 2 == 0) recipient.board[i][j] = new tile(2)
               else recipient.board[i][j] = new tile(0)
            }
         }
      }, priority: -1}],
      garbage_pattern: {effect: (recipient, input) => {
         let this_mod = mods[9]
         this_mod.lower_variation = Math.random() < 0.5
         recipient.ruleset.garbage_well_amount = this_mod.lower_variation? 6 : 7
         return input
      }, priority: 0},
      placed: {effect: (recipient, input) => {
         let this_mod = mods[9]
         if(input.garbage_cleared > 0) this_mod.garbage_cleared = true
         if(input.lines_cleared > 0) this_mod.line_cleared = true
         recipient.btb = -1
         return input
      }, priority: 0},
      attack: {effect: (recipient, input) => {
         if(input.type == "normal"){
            let this_mod = mods[9]
            if(this_mod.blight) input.amount *= 1.75
            else if(!this_mod.garbage_cleared) input.amount = 0
            if(this_mod.line_cleared){
               if(this_mod.blight && !this_mod.garbage_cleared) recipient.create_attacks(1, "starsurge")
               this_mod.blight = this_mod.garbage_cleared
            }
            this_mod.garbage_cleared = false
            this_mod.line_cleared = false
         }
         return input
      }, priority: 0},
      render: {effect: (recipient, input) => {
         let this_mod = mods[9]
         if(this_mod.blight) $("#board .powah").html("&#x272E; BLIGHT &#x272E;").css("display", "block")
         return input
      }, priority: 0},
      piece_spawn: {effect: (recipient, input) => {
         while(recipient.board.filter(row => row.find(cell => cell.type == 2)).length < Math.min(4, recipient.current_board_dimensions.y - 3)) recipient.inject_garbage()
         return input
      }, priority: 0}
   },
   {
      name: "invisible",
      target_opacity: 0,
      time_since_flash: 0,
      start: {effect: (recipient, input) => {
         let this_mod = mods[10]
         this_mod.target_opacity = 0
         this_mod.time_since_flash = 0
      }, priority: 0},
      tick: {effect: (recipient, input) => {
         let this_mod = mods[10]
         this_mod.time_since_flash += input.delta
         if(this_mod.time_since_flash > 5) this_mod.time_since_flash -= 5
         if(this_mod.time_since_flash < 0.2) this_mod.target_opacity = this_mod.time_since_flash / 0.2
         else this_mod.target_opacity = 1 - (this_mod.time_since_flash - 0.5) / 1.1
         recipient.board.forEach(row => {row.forEach(cell => {
            if(cell.type == 1){
               cell.opacity += Math.sign(this_mod.target_opacity - cell.opacity) * Math.min(Math.abs(this_mod.target_opacity - cell.opacity), 3 * input.delta)
               cell.opacity = Math.min(1, Math.max(0, cell.opacity))
            }
         })})
         return input
      }, priority: 0}
   },
   {
      name: "exile",
      start: [{effect: (recipient, input) => {
         recipient.ruleset.garbage_entry_delay = [2.5,2.5,2.5,2.5,2.5,2.5,2,1.5,1,0.5]
         recipient.enable_hard_mode()
      }, priority: 0},
      {effect: (recipient, input) => {
         let to_add = Math.max(0, Math.min(3, recipient.current_board_dimensions.y - 2) - recipient.board.filter(row => row.find(cell => cell.type == 2)).length - recipient.garbage_queue.reduce((sum,chunk) => sum + chunk.size, 0))
         for(let i = 0; i < to_add; i++) recipient.garbage_queue.push({size: 1, time_in_queue: 5})
         recipient.separate_garbage[0] += to_add
      }, priority: -3}],
      tick: {effect: (recipient, input) => {
         recipient.board.forEach((row) => {row.forEach(cell => {
            if(cell.type == 1){
               cell.opacity -= Math.min(cell.opacity, 3 * input.delta)
               cell.opacity = Math.min(1, Math.max(0, cell.opacity))
            }
            if([2,5].includes(cell.type)){
               let garbage_rows = recipient.board.filter(row => row.find(cell => cell.type == 2))
               garbage_rows = garbage_rows.slice(garbage_rows.length - 3)
               cell.opacity = ((garbage_rows.findIndex(a_row => a_row == row) + 1) + 3 - Math.min(3, garbage_rows.length)) / 3 - 0.1
            }
         })})
         return input
      }, priority: 0}
   },
   {
      name: "all-spin",
      previous: {
         amount: -1,
         piece: "",
         spun: 0
      },
      wounds_to_inject: 0,
      start: [{effect: (recipient, input) => {
         recipient.ruleset.attack_table.spin = [0,2,4,6,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50]
         recipient.ruleset.minimum_action_text_opacity = 0.7
         mods[12].previous.amount = -1
      }, priority: 0},
      {effect: (recipient, input) => {
         recipient.ruleset.available_pieces.forEach(piece => {if(piece.spin_detection == "none") piece.spin_detection = "immobility"})
      }, priority: -1}],
      placed: {effect: (recipient, input) => {
         let this_mod = mods[12]
         if(input.lines_cleared > 0 || recipient.piece_spinnin > 0){
            if(input.lines_cleared == this_mod.previous.amount && ((recipient.piece_spinnin == 0 && this_mod.previous.spun == 0) || (recipient.piece_spinnin == this_mod.previous.spun && recipient.controlled_piece.name == this_mod.previous.piece))){
               recipient.ruleset.action_text_colour = "red"
               this_mod.wounds_to_inject++
               if(input.lines_cleared > 0) recipient.board.forEach(row => row.forEach(cell => {if(cell.type == 4) cell.subtype.counter++}))
            }
            else recipient.ruleset.action_text_colour = "white"
            this_mod.previous.amount = input.lines_cleared
            this_mod.previous.spun = recipient.piece_spinnin
            this_mod.previous.piece = recipient.controlled_piece.name
         }
         return input
      }, priority: 0},
      piece_spawn: {effect: (recipient, input) => {
         let this_mod = mods[12]
         while(this_mod.wounds_to_inject > 0){
            recipient.inject_garbage(false, 0, "wound", recipient.floor + 5, recipient.randomize_garbage_pattern(true))
            this_mod.wounds_to_inject--
         }
         return input
      }, priority: 0}
   },
   {
      name: "warlock",
      previous_amount: -2,
      wounds_to_inject: 0,
      garbo_curse: false,
      usual_mult: 1,
      start: [{effect: (recipient, input) => {
         recipient.ruleset.attack_table.spin = [0,2,4,6,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50]
         recipient.ruleset.garbage_line_protection_max_stacks = 5
         recipient.ruleset.garbage_entry_delay = [2.5,2.5,2.5,2.5,2.5,2.5,2,1.5,1,0.5]
         recipient.ruleset.garbage_messiness += 0.3
         recipient.enable_hard_mode()
         recipient.ruleset.gravity_increase = 0
         recipient.ruleset.minimum_action_text_opacity = 0.7
         recipient.ruleset.btb_charging_starting_surge = 4
         recipient.ruleset.btb_chaining_thresholds = [1,4]
         mods[13].previous_amount = -2
         mods[13].garbo_curse = false
      }, priority: 0},
      {effect: (recipient, input) => {
         let to_add = Math.max(0, Math.min(10, recipient.current_board_dimensions.y - 2) - recipient.board.findLastIndex(row => row.find(cell => cell.type == 2)) - 1 - recipient.garbage_queue.reduce((sum,chunk) => sum + chunk.size, 0))
         for(let i = 0; i < to_add; i++) recipient.garbage_queue.push({size: 1, time_in_queue: 5})
         recipient.separate_garbage[0] += to_add
         recipient.ruleset.available_pieces.forEach(piece => {if(piece.spin_detection == "none") piece.spin_detection = "immobility"})
      }, priority: -3}],
      placed: {effect: (recipient, input) => {
         let this_mod = mods[13]
         if(input.lines_cleared > 0 || recipient.piece_spinnin > 0){
            if(!recipient.piece_spinnin && this_mod.previous_amount == -1 || (recipient.piece_spinnin && input.lines_cleared == this_mod.previous_amount)){
               recipient.ruleset.action_text_colour = "red"
               this_mod.wounds_to_inject += 20
               recipient.clutch = false
               if(input.lines_cleared > 0) recipient.board.forEach(row => row.forEach(cell => {if(cell.type == 4) cell.subtype.counter++}))
            }
            else recipient.ruleset.action_text_colour = "white"
            this_mod.previous_amount = recipient.piece_spinnin? input.lines_cleared : -1
            if(!recipient.piece_spinnin){
               recipient.action_text = "VOID"
               input.attacks = (recipient.combo >= 2)? Math.log(1 + 1.25 * this.combo) : 0
               if(input.pc > 0) input.attacks += (input.pc == 2)? recipient.ruleset.pc_attacks : recipient.ruleset.cc_attacks
               recipient.btb = -1
               if(recipient.powah > 0){
                  recipient.create_attacks(recipient.powah, "starsurge")
                  recipient.powah = 0
                  input.dropped = true
               }
            }
            else if(input.lines_cleared == 0 && (recipient.btb >= 4 || (recipient.mods.includes(9) && mods[9].blight))){
               input.attacks = 1 + (recipient.btb > 0)? 1 : 0
               recipient.btb++
               recipient.powah++
            }
         }
         if(!this_mod.garbo_curse && recipient.garbage_lines_cleared < 5 && recipient.altitude > 800){
            this_mod.garbo_curse = true
            this_mod.usual_mult = recipient.ruleset.climb_xp_gain_mult
            recipient.ruleset.climb_xp_gain_mult = 0
         }
         if(this_mod.garbo_curse && recipient.garbage_cleared >= 5){
            this_mod.garbo_curse = false
            recipient.ruleset.climb_xp_gain_mult = this_mod.usual_mult
         }
         return input
      }, priority: 0},
      piece_spawn: {effect: (recipient, input) => {
         let this_mod = mods[13]
         while(this_mod.wounds_to_inject > 0){
            recipient.inject_garbage(false, 0, "wound", recipient.floor + 5, recipient.randomize_garbage_pattern(true))
            this_mod.wounds_to_inject--
         }
         return input
      }, priority: 0},
      render: {effect: (recipient, input) => {
         $("#board .powah").css("color","black").css("text-shadow","0 0 5px rgba(255, 255, 255, 1)")
         return input
      }, priority: 0}
   },
   {
      name: "expert",
      start: {effect: (recipient, input) => {
         recipient.ruleset.garbage_entry_delay = [2.2,2,1.8,1.6,1.4,1.2,1,0.8,0.6,0.4]
         recipient.ruleset.garbage_messiness += 0.02
         recipient.ruleset.garbage_messiness_per_floor = 0.05
         recipient.ruleset.climb_xp_gain_methods.clear = false
         recipient.ruleset.climb_xp_gain_methods.block = false
         recipient.ruleset.climb_xp_loss_factor = 5
         recipient.ruleset.instant_garbage_entry = true
         recipient.garbage_received_mults.expert = 1.5
         recipient.ruleset.garbage_favour -= 33
         recipient.enable_hard_mode()
      }, priority: 0},
   },
   {
      name: "tyrant",
      altitude_loss: [0.6,0.8,1.1,1.5,2,2.6,3.3,4.1,5,6],
      time_on_floor: -60,
      start: {effect: (recipient, input) => {
         let this_mod = mods[15]
         this_mod.time_on_floor = -60
         recipient.ruleset.garbage_entry_delay = [2.2,2,1.8,1.6,1.4,1.2,1,0.8,0.6,0.4]
         recipient.ruleset.garbage_messiness += 0.02
         recipient.ruleset.garbage_messiness_per_floor = 0.05
         recipient.ruleset.climb_xp_gain_methods.clear = false
         recipient.ruleset.climb_xp_gain_methods.block = false
         recipient.ruleset.climb_xp_loss_factor = 5
         recipient.ruleset.instant_garbage_entry = true
         recipient.garbage_received_mults.expert = 1.5
         recipient.garbage_received_mults.your_taking_too_long = 1
         recipient.ruleset.garbage_favour -= 33
         recipient.ruleset.targeting_grace_release_time = [1,0.9,0.8,0.7,0.6,0.5,0.4,0.3,0.2,0.1]
         recipient.ruleset.passive_altitude_gain = 0
         recipient.ruleset.KO_altitude_gain = 8
         recipient.remove_base_fatigue()
         recipient.ruleset.fatigue.push(
            {time: 360, effect: (player) => {player.ruleset.targeting_grace_max_messiness_reduction = 0}, description: "YOUR POWER SLIPS… garbage received becomes messier"},
            {time: 420, effect: (player) => {player.garbage_received_mults.fatigue += 0.25}, description: "WHISPERS OF DISCONTENT SPREAD… receive 25% more garbage"},
            {time: 480, effect: (player) => {player.manual_delayed_injection(3, 0.8, "perma")}, description: "PROTESTERS LINE THE STREETS… +3 PERMANENT LINES"},
            {time: 540, effect: (player) => {player.garbage_received_mults.fatigue += 0.25}, description: "YOUR CLOSEST ALLIES DEFECT… receive 25% more garbage"},
            {time: 600, effect: (player) => {player.manual_delayed_injection(5, 0.8, "perma")}, description: "PARANOIA CLOUDS YOUR JUDGEMENT… +5 PERMANENT LINES"},
            {time: 660, effect: (player) => {player.ruleset.garbage_messiness = Math.max(1, player.ruleset.garbage_messiness)}, description: "THE REVOLUTION HAS BEGUN… garbage received becomes much messier"},
            {time: 720, effect: (player) => {player.manual_delayed_injection(12, 0.8, "perma")}, description: "THE END OF AN ERA. +12 PERMANENT LINES"},
         )
         recipient.enable_hard_mode()
      }, priority: 0},
      tick: {effect: (recipient, input) => {
         let this_mod = mods[15]
         recipient.altitude = Math.max(recipient.altitude - this_mod.altitude_loss[recipient.floor-1] * input.delta, recipient.ruleset.floor_tresholds[recipient.floor])
         this_mod.time_on_floor += input.delta
         if(this_mod.time_on_floor > 0) {
            recipient.garbage_received_mults.your_taking_too_long += this_mod.time_on_floor * 0.005
            this_mod.time_on_floor = 0
         }
         return input
      }, priority: 0},
      floor: {effect: (recipient, input) => {
         let this_mod = mods[15]
         this_mod.time_on_floor = -60
      }, priority: 0}
   },
   {
      name: "snowball board",
      line_counter: 0,
      dimensions: 4,
      start: {effect: (recipient, input) => {
         let this_mod = mods[16]
         this_mod.dimensions = 4
         this_mod.line_counter = 0
         recipient.ruleset.board_dimensions = new vector(4,4)
         recipient.recalculate_board_dimensions() 
      }, priority: 0},
      placed: {effect: (recipient, input) => {
         let this_mod = mods[16]
         this_mod.line_counter += input.lines_cleared
         if(this_mod.line_counter >= 20 && this_mod.dimensions < 20){
            this_mod.dimensions++
            this_mod.line_counter -= 20
            recipient.ruleset.board_dimensions = new vector(this_mod.dimensions, this_mod.dimensions)
            recipient.recalculate_board_dimensions()
         }
         return input
      }, priority: 0},
      render: {effect: (recipient, input) => {
         if(mods[16].dimensions < 20) $("#mod-16-name").html("SNOWBALL BOARD " + mods[16].line_counter + "/20")
         return input
      }, priority: 0}
   },
   {
      name: "permafrost board",
      line_counter: 0,
      dimensions: 4,
      start: {effect: (recipient, input) => {
         let this_mod = mods[17]
         this_mod.dimensions = 4
         this_mod.line_counter = 0
         recipient.ruleset.board_dimensions = new vector(4,4)
         recipient.recalculate_board_dimensions()
         recipient.ruleset.DAS = 0.003333
         recipient.ruleset.ARR = 0.003333
         recipient.ruleset.garbage_entry_delay = [2.5,2.5,2.5,2.5,2.5,2.5,2,1.5,1,0.5]
         recipient.enable_hard_mode()
      }, priority: 0},
      placed: {effect: (recipient, input) => {
         let this_mod = mods[17]
         this_mod.line_counter += input.lines_cleared
         if(this_mod.line_counter >= 20 && this_mod.dimensions < 20){
            this_mod.dimensions++
            this_mod.line_counter -= 20
            recipient.ruleset.board_dimensions = new vector(this_mod.dimensions, this_mod.dimensions)
            recipient.recalculate_board_dimensions()
         }
         return input
      }, priority: 0},
      render: {effect: (recipient, input) => {
         if(mods[17].dimensions < 20) $("#mod-17-name").html("PERMAFROST BOARD " + mods[17].line_counter + "/20")
         return input
      }, priority: 0}
   },
   {
      name: "backfire",
      sent: {effect: (recipient, input) => {
         let backfire_amount = input.amount * 0.75
         if(backfire_amount % 1 != 0){
            if(Math.random() < backfire_amount - parseInt(backfire_amount)) backfire_amount += 1
            backfire_amount = parseInt(backfire_amount)
         }
         if(backfire_amount >= recipient.ruleset.windup_threshold) recipient.windups.push({chunks: backfire_amount, time: 0, chunk_amount: 0})
         else if(backfire_amount >= 1) recipient.garbage_queue.push({size: backfire_amount, time_in_queue: recipient.ruleset.garbage_entry_delay[recipient.floor-1]-0.5})
         return input
      }, priority: 0}
   },
   {
      name: "reckoning",
      stored_attacks: 0,
      start: {effect: (recipient, input) => {
         recipient.ruleset.garbage_entry_delay = [2.5,2.5,2.5,2.5,2.5,2.5,2,1.5,1,0.5]
         recipient.enable_hard_mode()
         recipient.ruleset.floor_barriers = false
         recipient.ruleset.floor_cross_altitude = 0
         recipient.ruleset.KO_altitude_gain = 0
         recipient.ruleset.climb_xp_gain_methods.block = false
         if(!recipient.mods.includes(15)) recipient.ruleset.passive_altitude_gain = 0.5
         mods[19].stored_attacks = 0
      }, priority: 0},
      sent: {effect: (recipient, input) => {
         mods[19].stored_attacks += 0.3 * input.amount
         let backfire_amount = input.amount
         if(backfire_amount >= recipient.ruleset.windup_threshold) recipient.windups.push({chunks: backfire_amount, time: 0, chunk_amount: 0})
         else if(backfire_amount >= 1) recipient.garbage_queue.push({size: backfire_amount, time_in_queue: recipient.ruleset.garbage_entry_delay[recipient.floor-1]-0.5})
         return input
      }, priority: 0},
      region: {effect: (recipient, input) => {
         let this_mod = mods[19]
         this_mod.stored_attacks = parseInt(this_mod.stored_attacks)
         if(this_mod.stored_attacks >= recipient.ruleset.windup_threshold){
            while(this_mod.stored_attacks > 0){
               recipient.windups.push({chunks: Math.min(this_mod.stored_attacks, recipient.ruleset.windup_maximum_attack), time: 0, chunk_amount: 0})
               this_mod.stored_attacks -= Math.min(this_mod.stored_attacks, recipient.ruleset.windup_maximum_attack)
            }
         }
         else if(this_mod.stored_attacks >= 1) recipient.garbage_queue.push({size: this_mod.stored_attacks, time_in_queue: 0})
         this_mod.stored_attacks = 0
      }, priority: 0},
      render: {effect: (recipient, input) => {
         if(mods[19].stored_attacks >= 1) $("#mod-19-name").html("RECKONING <span style='color:orange;'>&#x26A0; " + Math.floor(mods[19].stored_attacks) + " &#x26A0;</span>")
         return input
      }, priority: 0}
   },
   {
      name: "bomb garbage",
      start: {effect: (recipient, input) => {
         recipient.garbage_received_mults.bombs = 1.25
         recipient.ruleset.targeting_grace_mult *= 0.8
         recipient.ruleset.garbage_messiness += 0.05
      }, priority: 0},
      garbage: {effect: (recipient, input) => {
         input.garbage_pattern = input.garbage_pattern.map(type => type == 0? 2 : type)
         return input
      }, priority: -2}
   },
   {
      name: "duality",
      bomb_pattern: [],
      bomb_pattern_change_chance: [0.3,0.34,0.38,0.42,0.46,0.5,0.54,0.58,0.62,0.66],
      piece_counter: 0,
      start: {effect: (recipient, input) => {
         let this_mod = mods[21]
         this_mod.bomb_pattern = []
         this_mod.piece_counter = 0
         recipient.ruleset.garbage_entry_delay = [2.5,2.5,2.5,2.5,2.5,2.5,2,1.5,1,0.5]
         recipient.enable_hard_mode()
         recipient.garbage_received_mults.bombs = 1.25
         recipient.ruleset.targeting_grace_mult *= 0.8
         recipient.ruleset.garbage_messiness += 0.05
         recipient.ruleset.garbage_well_amount++
         recipient.ruleset.garbage_line_protection_max_stacks = 5
      }, priority: 0},
      garbage: {effect: (recipient, input) => {
         let this_mod = mods[21]
         let pattern = input.garbage_pattern.map((column, index) => column == 0? index : undefined).filter(column => column != undefined)
         pattern.sort(() => Math.random() - 0.5)
         let chosen_columns = []
         if(Math.random() > this_mod.bomb_pattern_change_chance[recipient.floor-1]){
            chosen_columns = chosen_columns.concat(this_mod.bomb_pattern.filter(col => pattern.includes(col)))
         }
         let target_amount = pattern.length/2
         if(target_amount % 1 != 0){
            if(Math.random() < 0.5) target_amount++
            target_amount -= 0.5
         }
         while(chosen_columns.length < target_amount){
            chosen_columns.push(pattern.pop())
         }
         chosen_columns.sort(() => Math.random() - 0.5)
         while(chosen_columns.length > target_amount){
            chosen_columns.pop()
         }
         chosen_columns.forEach(col => input.garbage_pattern[col] = 2)
         this_mod.bomb_pattern = chosen_columns
         return input
      }, priority: -2},
      piece_created: {effect: (recipient, input) => {
         let this_mod = mods[21]
         this_mod.piece_counter++
         if(this_mod.piece_counter >= 6){
            this_mod.piece_counter = 0
            let index = Math.floor(Math.random() * input.new_piece.tile_type.length)
            console.log(index)
            let after = [input.new_piece.tile_type[index].type, input.new_piece.tile_type[index].subtype]
            input.new_piece.tile_type[index].type = 5
            input.new_piece.tile_type[index].subtype = {primed: false, post: after}
         }
         return input
      }, priority: 0}
   },
   {
      name: "blockade",
      add_blockade: (recipient) => {
         let columns = []
         for(let i = 0; i < recipient.current_board_dimensions.x; i++) columns.push(i)
         let choices = recipient.current_board_dimensions.x / 2
         if(choices % 1 != 0){
            if(Math.random() < 0.5) choices++
            choices -= 0.5
         }
         while(columns.length > choices){
            recipient.board[recipient.garbage_entry_row][columns.splice(Math.floor(Math.random() * columns.length),1)[0]] = new tile(2, 1)
         }
      },
      start: {effect: (recipient, input) => {
         mods[22].add_blockade(recipient)
      }, priority: -2},
      piece_spawn: {effect: (recipient, input) => {
         if(!recipient.board.find(row => row.find(cell => cell.type == 2 && cell.subtype == 1))){
            for(let i = recipient.board.length - 1; i >= recipient.garbage_entry_row; i--){
               for(let j = 0; j < recipient.board[i].length; j++){
                  if(recipient.board[i][j].type != 0){
                     if(i == recipient.board.length - 1) death(recipient)
                     else {
                        recipient.board[i + 1][j] = recipient.board[i][j]
                        recipient.board[i][j] = new tile(0)
                     }
                  }
               }
            }
            mods[22].add_blockade(recipient)
         }
         return input
      }, priority: 0}
   },
   {
      name: "mining operation",
      time_since_injection: 0,
      add_blockade: (recipient, row_offset = 0) => {
         let columns = []
         let chosen = []
         for(let i = 0; i < recipient.current_board_dimensions.x; i++) columns.push(i)
         let choices = recipient.current_board_dimensions.x / 2
         if(choices % 1 != 0){
            if(Math.random() < 0.5) choices++
            choices -= 0.5
         }
         while(columns.length > choices){
            chosen.push(columns.splice(Math.floor(Math.random() * columns.length),1)[0])
         }
         recipient.board[recipient.garbage_entry_row + row_offset] = recipient.board[recipient.garbage_entry_row + row_offset].map((cell,index) => chosen.includes(index)? (new tile(2, 1)) : (new tile(0)))
      },
      start: {effect: (recipient, input) => {
         let this_mod = mods[23]
         this_mod.add_blockade(recipient)
         this_mod.add_blockade(recipient,1)
         recipient.ruleset.garbage_entry_delay = [2.5,2.5,2.5,2.5,2.5,2.5,2,1.5,1,0.5]
         recipient.enable_hard_mode()
         this_mod.time_since_injection = 0
      }, priority: -2},
      piece_spawn: {effect: (recipient, input) => {
         while(recipient.board.filter(row => row.find(cell => cell.type == 2 && cell.subtype == 1)).length < 2){
            for(let i = recipient.board.length - 1; i >= recipient.garbage_entry_row; i--){
               for(let j = 0; j < recipient.board[i].length; j++){
                  if(recipient.board[i][j].type != 0){
                     if(i == recipient.board.length - 1) death(recipient)
                     else {
                        recipient.board[i + 1][j] = recipient.board[i][j]
                        recipient.board[i][j] = new tile(0)
                     }
                  }
               }
            }
            mods[23].add_blockade(recipient)
         }
         return input
      }, priority: 0},
      tick: {effect: (recipient, input) => {
         let this_mod = mods[23]
         this_mod.time_since_injection += input.delta
         if(this_mod.time_since_injection > 7 - recipient.floor * 0.4) {
            this_mod.time_since_injection -= 7 - recipient.floor * 0.4
            recipient.inject_garbage(false)
         }
         let the_row = recipient.board.findLastIndex(row => row.find(cell => cell.type == 2 && cell.subtype == 1))
         recipient.board.forEach((row, yindex) => {row.forEach(cell => {
            if([1,2,5].includes(cell.type)){
               if(yindex < the_row) cell.opacity = (row.find(cellb => cellb.type == 2 && cellb.subtype == 1))? 0.6 : 0
               else cell.opacity = 1
            }
         })})
         return input
      }, priority: 1}
   },
]