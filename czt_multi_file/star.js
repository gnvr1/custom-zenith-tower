const tier_mults = [0,1,3,10]
class attack_star {
   orgin = new vector(0,0)
   destination = new vector(1,1)
   color = "#FFFF00"
   travel_time = 0.25
   tier = 1
   current_lifetime = 0
   defensive = false
   constructor(orgin, max_distance, tier = 1, defensive = false, defensive_destination = new vector(0,0)){
      this.defensive = defensive
      this.orgin = orgin.add(new vector(-10 * tier_mults[tier],-15 * tier_mults[tier]))
      this.tier = tier
      if(!defensive){
         const angle = Math.random() * 2 * Math.PI
         const distance = Math.random() * max_distance + 35 - 15 * tier
         this.destination = new vector(this.orgin.x + distance * Math.sin(angle), this.orgin.y + distance * Math.cos(angle))
         this.color = "hsl("+ (Math.random() * 30 + 45) +", 100%, "+ (Math.random() * 15 + 50) +"%)"
         this.travel_time += 0.1 * tier
      }
      else{
         this.destination = defensive_destination
         this.color = "cornflowerblue"
      }
   }
}