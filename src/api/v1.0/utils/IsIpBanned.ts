import bannedIps from "@src/ips.json"

export const isIpBanned = (user_ip: string): boolean  => {
  user_ip = user_ip.slice(7)
  var isBanned: boolean = false

  bannedIps.forEach(ip => {
    if(ip == user_ip) {
      return isBanned = true
    } else {
      return isBanned = false
    }
  })

  return isBanned
}