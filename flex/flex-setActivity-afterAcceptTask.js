/**
 * This is how you can change agent activity on accepting task (for available activities) 
 */

flex.Actions.addListener("afterAcceptTask", (payload) => {
  console.log(`afterAcceptTask`, payload);
  // Need to set a delay to avoid race condition of pending task prevengint changing agent activity
  setTimeout(() => {  
    flex.Actions.invokeAction("SetActivity", { activitySid: 'WAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' });
    console.log(`set activity to `, 'WAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  }, 1000);
});
  