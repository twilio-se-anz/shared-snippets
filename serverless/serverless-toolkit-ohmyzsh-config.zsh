
#### 
# Theme Configuration
####

# Using jq to parse Server Toolkit config json file to find the active profile. This is more performant than using twilio profiles:list command.
twilio_prompt_profile() {
  jq -r .activeProject < ~/.twilio-cli/config.json
}

# Example of how to use twilio_prompt_profile in PROMPT
PROMPT+=' %B%F{red}$(twilio_prompt_profile)%f$b '

####
# Plugins Configuration
####

# Twilio Profile switcher. Looks for a .twilio-profile file in the current directory and switches to that profile.
function twilio-profile() {
  if [[ -f .twilio-profile ]]; then
    twilio profiles:use $(cat .twilio-profile)
  fi
}