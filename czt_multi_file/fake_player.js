class fake_player {
   attacks_received = 0
   dss = 0
   apm = 0
   skill_score = 0
   prepared_apm = 0
   time = 0
   altitude = 0
   csp = 1
   cxp = 0
   garbage_queue = 0
   entering_garbage = 0
   board = 0
   last_attacker = undefined
   sent_attacks = 0
   verbose = false
   targeting_grace = 0
   deaths = 0
   update(){
      this.time += 0.5
      this.altitude += this.csp / 8
      this.cxp -= (this.csp * this.csp + this.csp) / 60 * 1.5
      this.targeting_grace -= Math.min(this.targeting_grace, 1/(8*Math.pow(0.74,this.altitude/165)), 2.5)
      if(this.cxp < 0){
         if(this.csp > 1) {
            this.csp--
            this.cxp = this.csp * 4
         }
         else this.cxp = 0
      }
      if(this.board > 2) {this.board -= this.dss / 2; this.cxp += this.dss / 2}
      if(this.board > 21) death(this)
      if(this.board < 6) this.board += Math.cbrt(this.apm) / 10
      this.prepared_apm += this.apm / 120
      if(this.prepared_apm >= 1 && Math.random() < 0.03 + 0.05 * this.skill_score) this.create_attacks(1)
      else if(this.prepared_apm >= 2 && Math.random() < 0.03 + 0.04 * this.skill_score) this.create_attacks(2)
      else if(this.prepared_apm >= 4 && Math.random() < 0.7 / (Math.pow(2*this.skill_score - 0.5, 2) + 1.8) - 0.15) this.create_attacks(4)
      else if(this.prepared_apm >= 5 && Math.random() < 0.5 / (Math.pow(2*this.skill_score - 1.4, 2) + 1.3) - 0.25) this.create_attacks(5)
      else if(this.prepared_apm >= 10 && Math.random() < 1.008 - Math.pow(this.skill_score, 0.05)) this.create_attacks(this.prepared_apm)
      else if(this.board + this.garbage_queue + this.entering_garbage > 16 && this.prepared_apm >= 5) this.create_attacks(5)
      else{
         this.board += Math.min(this.entering_garbage, 4)
         if(this.verbose && this.entering_garbage) console.log("injected garbage", Math.min(this.entering_garbage, 4), "board", this.board)
         this.entering_garbage -= Math.min(this.entering_garbage, 4)
         this.entering_garbage += Math.min(this.garbage_queue, 6)
         if(this.verbose && this.garbage_queue) console.log("tanked garbage", Math.min(this.garbage_queue, 6))
         this.garbage_queue -= Math.min(this.garbage_queue, 6)
      }
   }
   create_attacks(amount){
      if(Math.random() < amount - parseInt(amount)) amount++
      this.prepared_apm -= amount
      amount = parseInt(amount)
      let cancelled = 0
      while(this.garbage_queue > 0 && amount > 0){
         this.garbage_queue--
         amount--
         cancelled++
         this.cxp += 0.52
      }
      if(this.verbose && cancelled) console.log("cancelled", cancelled)
      if(amount > 0){
         this.altitude += amount * this.csp / 4
         this.cxp += 0.05 + amount
         send_attacks(this, amount)
         this.sent_attacks += amount
         if(this.verbose) console.log("sent", amount, "altitude", this.altitude)
      }
      if(this.cxp > this.csp * 4){
         this.cxp -= this.csp * 4
         this.csp++
         this.csp += parseInt(this.cxp / this.csp / 4)
         this.cxp += this.csp * 1.5
      }
   }
   constructor(skill){
      this.skill_score = skill
      this.apm = 20 * Math.pow(skill, 20) + Math.pow(skill, 4) * 80 + skill * 20 + Math.sqrt(skill) * 20 + 5
      this.dss = 1 * Math.pow(skill, 3) + 1 * skill + 0.15
      this.update_timer = window.setInterval(() => {this.update()}, 500)
   }
}