/**
 * This example show how to filter based on worker attributes. Set the worker attribute when the task is reserved. Unset when task completed
 * Filter Workerdirectory Tab based on expression filtering in call agents out of the selection.
 */

init(flex, manager) {

  //helper function to set attributes
  const setCustomAttributes = (worker, status) => {
    worker.setAttributes({...worker.attributes, inCall: status});
  
  // Filter Agents in the transfer worker directory to only show those not in a call
  flex.WorkerDirectoryTabs.defaultProps.hiddenWorkerFilter = 'data.attributes.inCall not_eq "true"';

  }

  //event listener for reservation created and completed
  manager.workerClient.on("reservationCreated", function(reservation) {
    setCustomAttributes(manager.workerClient, true);  
    reservation.on('completed', () => {
      setCustomAttributes(manager.workerClient, false); 
    });
  });
}