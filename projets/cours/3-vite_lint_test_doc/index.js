import { cleanUsername } from "./Utils.js"

const tests = [
  "username",
  "USERNAME",
  "username@domain.tld",
  "user.name@domain.tld",
  "user_name",
  "user123",
  "user.name.extra@domain.tld"
]

tests.forEach((t) => {
  console.log(`${t} => ${cleanUsername(t)}`)
})