class fake_player {
   attacks_received = 0
   dss = 0
   apm = 0
   skill_score = 0
   prepared_apm = 0
   time = 0
   altitude = 0
   floor = 1
   csp = 1
   cxp = 0
   cxplock = 0
   garbage_queue = []
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
      this.targeting_grace -= 0.5/[4.8, 3.9, 2.1, 1.4, 1.3, 0.9, 0.6, 0.4, 0.3, 0.2][this.floor-1]
      if(this.targeting_grace < 0) this.targeting_grace = 0
      if(this.board > 2) {let downstacked = this.dss / 2 * (1 - 0.05 * this.floor); this.board -= downstacked; this.cxp += downstacked; this.prepared_apm += downstacked}
      if(this.board > 21) death(this)
      //if(this.board < 6) this.board += Math.cbrt(this.apm) / 10
      this.prepared_apm += this.apm / 120
      if(this.prepared_apm >= 1 && Math.random() < 0.05 + 0.03 * this.skill_score) this.create_attacks(1)
      else if(this.prepared_apm >= 2 && Math.random() < 0.04 + 0.04 * this.skill_score) this.create_attacks(2)
      else if(this.prepared_apm >= 4 && Math.random() < 0.7 / (Math.pow(2*this.skill_score - 0.5, 2) + 1.8) - 0.15) this.create_attacks(4)
      else if(this.prepared_apm >= 5 && Math.random() < 0.5 / (Math.pow(2*this.skill_score - 1.4, 2) + 1.3) - 0.25) this.create_attacks(5)
      else if(this.prepared_apm >= 6 && Math.random() < 1.008 - Math.pow(this.skill_score, 0.05)) this.create_attacks(this.prepared_apm)
      else if(this.board + this.garbage_queue.length + this.entering_garbage > 16 && this.prepared_apm >= 4) this.create_attacks(this.prepared_apm)
      else{
         this.board += Math.min(this.entering_garbage, 4)
         if(this.verbose && this.entering_garbage) console.log("injected garbage", Math.min(this.entering_garbage, 4), "board", this.board)
         this.entering_garbage -= Math.min(this.entering_garbage, 4)
         const garbage_accepted = Math.min(this.garbage_queue.filter(cd => cd <= 0).length, 8)
         this.entering_garbage += garbage_accepted
         if(this.verbose && this.garbage_queue.length > 0) console.log("tanked garbage", garbage_accepted)
         for(let i = 0; i < garbage_accepted; i++) this.garbage_queue.shift()
      }
      if(this.cxplock <= 0) this.cxp -= (this.csp * this.csp + this.csp) / 60 * 1.5
      else this.cxplock--
      if(this.cxp > this.csp * 4){
         this.cxp -= this.csp * 4
         this.csp++
         this.csp += parseInt(this.cxp / this.csp / 4)
         this.cxplock = 8
      }
      if(this.cxp < 0){
         if(this.csp > 1) {
            this.csp--
            this.cxp = this.csp * 4
         }
         else this.cxp = 0
      }
      if(this.altitude > [50,150,300,450,650,850,1100,1350,1650,Infinity][this.floor-1]){
         this.altitude += 3
         this.floor++
      }
      this.garbage_queue = this.garbage_queue.map(x => x - 1)
   }
   create_attacks(amount){
      if(Math.random() < amount - parseInt(amount)) amount++
      this.prepared_apm -= amount
      amount = parseInt(amount)
      //if(amount > 20) console.log(this.skill_score.toFixed(3), "POP", amount)
      let cancelled = 0
      while(this.garbage_queue.length > 0 && amount > 0){
         this.garbage_queue.pop()
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
   }
   constructor(skill){
      this.skill_score = skill
      this.apm = 40 * Math.pow(skill, 15) + Math.pow(skill, 4) * 80 + skill * 40 + Math.cbrt(skill) * 15 + 7
      this.dss = 1.5 * Math.pow(skill, 1) + 0.4 * Math.sqrt(skill) + 0.05
      this.update_timer = window.setInterval(() => {this.update()}, 500)
   }
}