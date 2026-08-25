function send_attacks(sender, amount){
   if(amount > 7){
      send_attacks(sender, Math.floor(amount/2))
      send_attacks(sender, Math.ceil(amount/2))
   }
   else{
      tower.sort((a, b) => b.altitude - a.altitude)
      let weights = []
      let total_weight = 0
      tower.forEach(climber => {
         let weight = 0
         if(climber instanceof player){
            weight += climber.ruleset.base_targeting_factor
            weight -= Math.min(1, climber.targeting_grace / climber.ruleset.targeting_grace_effective_max) * climber.ruleset.targeting_grace_max_targeting_reduction
            weight -= Math.min(climber.ruleset.garbage_line_protection_max_stacks, climber.board.filter(row => row.find(cell => cell.type == 2)).length) * climber.ruleset.garbage_line_protection_reduction_per_line
            let flag = false
            for(let i = climber.current_board_dimensions.y + 3; i > climber.current_board_dimensions.y - 3; i--){
               if(climber.board[i].filter(cell => cell.type != 0).length > 0){flag = true; break}
            }
            if(flag) weight -= climber.ruleset.targeting_reduction_in_danger
         }
         else if(climber instanceof fake_player){
            weight += 3
            if(climber.time > 180) weight += 1
            if(climber.time > 300) weight += 1
            if(climber.time > 420) weight += 1
            weight -= Math.min(1, climber.targeting_grace / 12) * 3
            if(climber.board > 18) weight -= 1.5
         }
         if(weight < 0.001) weight = 0.001   
         weights.push(weight)
      })
      let index = tower.findIndex(player => player === sender)
      weights[index] = 0
      weights.forEach((p, p_index) => {if(Math.abs(index - p_index) > 10 && Math.abs(sender.altitude - tower[p_index].altitude) > 15){weights[p_index] *= Math.max(1/Math.pow(1.2, Math.abs(index - p_index)-6), 1/Math.pow(1.1, Math.abs(sender.altitude - tower[p_index].altitude)-15))}})
      let targeting_value = Math.random() * weights.reduce((sum, weight) => sum += weight, 0)
      let temp = targeting_value
      let final_index = -1
      while(targeting_value >= 0){
         final_index++
         targeting_value -= weights[final_index]
      }
      let target = tower[final_index]
      if(!target){console.log("thrown out", amount, temp, weights.reduce((sum, weight) => sum += weight, 0)); return}
      temp = amount
      let great_altitude
      great_altitude = Math.max(Math.min(sender.altitude,3500), Math.min(target.altitude-1000,2000))
      if(target.altitude > great_altitude) amount *= 1 + 0.004 * (target.altitude - great_altitude) * (target.altitude - great_altitude) / (target.altitude + great_altitude)
      if(target instanceof player){
         for(let i in target.garbage_received_boosts) amount += target.garbage_received_boosts[i]
         for(let i in target.garbage_received_mults) amount *= target.garbage_received_mults[i]
         if(target.targeting_grace > target.ruleset.targeting_grace_garbage_mult_threshold) amount *= 1 - ((target.targeting_grace - target.ruleset.targeting_grace_garbage_mult_threshold) * target.ruleset.targeting_grace_garbage_mult_per_point)
         if(Math.random() < amount - parseInt(amount)) amount++
         amount = parseInt(amount)
         //console.log("received from skill level", sender.skill_score, sender.apm, "at alt", sender.altitude, amount, "with weight", weights[final_index], 1/Math.pow(1.2, Math.abs(index - final_index)-6), 1/Math.pow(1.1, Math.abs(sender.altitude - target.altitude)-15))
         if(amount >= target.ruleset.windup_threshold) target.windups.push({chunks: amount, time: 0, chunk_amount: 0})
         else if(amount >= 1) target.garbage_queue.push({size: amount, time_in_queue: 0})
         target.targeting_grace = Math.min(target.targeting_grace + Math.floor(amount * target.ruleset.targeting_grace_mult), target.ruleset.targeting_grace_max)
      }
      else if(target instanceof fake_player){
         let time_mult = 1
         for(let i = 480; i <= 720; i += 60) if(target.time > i) time_mult += 0.15
         amount *= time_mult
         if(target.targeting_grace > 8) amount *= 1 - (target.targeting_grace - 8) * 0.05
         if(Math.random() < amount - parseInt(amount)) amount++
         amount = parseInt(amount)
         target.garbage_queue += amount
         if(target.verbose) console.log("received garbage", amount, "current_queue", target.garbage_queue)
         target.targeting_grace = Math.min(target.targeting_grace + amount, 18)
      }
      target.last_attacker = sender
      target.attacks_received += amount
   }
}
function death(corpse){
   window.clearInterval(corpse.update_timer)
   let index = tower.findIndex(player => player === corpse)
   delete tower[index]
   tower = tower.filter(player => player != undefined)
   if(corpse.last_attacker instanceof player){
      corpse.last_attacker.bonus_altitude += corpse.last_attacker.ruleset.KO_altitude_gain * corpse.last_attacker.climb_speed / 4 * corpse.last_attacker.ruleset.altitude_mult
      corpse.last_attacker.kos++
      corpse.last_attacker.add_top_text("Elimination!", 1)
   }
   if(corpse.last_attacker instanceof fake_player) corpse.last_attacker.altitude += 15 * corpse.last_attacker.csp / 4
   if(corpse instanceof fake_player && !tower.find(player => player.skill_score == corpse.skill_score)) {
      let revived = new fake_player(corpse.skill_score)
      revived.attacks_received = corpse.attacks_received
      revived.sent_attacks = corpse.sent_attacks
      revived.verbose = corpse.verbose
      revived.deaths = corpse.deaths+1
      tower.push(revived)
   }
   if(corpse instanceof player){
      corpse.render($("#board"))
      console.log(corpse)
      $("#board").css("scale",0)
      $("#results").css("display","flex")
      $("#altitude-show").html(corpse.altitude.toFixed(1) + " M")
      const stats_to_show = [{name: "TIME", value: corpse.time.toFixed(1)},{name: "PIECES PLACED", value: corpse.pieces_placed},
         {name: "PIECES PER SECOND", value: (corpse.pieces_placed / corpse.time).toFixed(2)},{name: "HOLDS", value: corpse.holds},
         {name: "LINES CLEARED", value: corpse.total_lines_cleared},{name: "ATTACKS", value: corpse.attacks_created},
         {name: "ATTACKS PER MINUTE", value: (corpse.attacks_created / corpse.time * 60).toFixed(2)},{name: "ATTACKS SENT", value: corpse.attacks_sent},
         {name: "ATTACKS RECEIVED", value: corpse.attacks_received},{name: "ATTACKS CANCELLED", value: corpse.attacks_cancelled},
         {name: "GARBAGE LINES CLEARED", value: corpse.garbage_lines_cleared},{name: "HIGHEST COMBO", value: corpse.highest_combo},
         {name: "HIGHEST B2B", value: corpse.highest_btb},{name: "HIGHEST CLIMB SPEED", value: corpse.highest_climb_speed},
         {name: "ALL CLEARS", value: corpse.all_clears},{name: "ELIMINATIONS", value: corpse.kos}
      ]
      $("#results table").empty()
      stats_to_show.forEach((stat,index) => {
         $("#stats-" + ((index < 0.5 * stats_to_show.length)? 1 : 2)).append(`<tr><td>${stat.name}</td><td>${stat.value}</td></tr>`)
      })
      window.setTimeout(() => { 
         $("#results").css("top",0).on("click",() => {
            $("#results").css("top", "-100vh").off("click")
            $("#background").css("display","none")
            rerender_mods()
            $("#menu").css("display","flex")
            $("body").css("overflow","auto")
            $("#board").css("display","none")
         })
      },1100)
   }
}