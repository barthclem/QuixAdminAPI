/**
 * Created by barthclem on 6/18/17.
 */
let scheduler = require('node-schedule');
let moment = require('moment');
let role = require('../config/constants').ROLES;
class Scheduler{

    /**
     * @description constructor
     *@param {object} eventService - an instance of event Service
     * @param {object} emailService - an instance of email Service
     */
    constructor(eventService, emailService){
        this.eventService = eventService;
       this.emailService = emailService;
       this.participantEmailScheduleArray = [];
       this.eventAdminEmailScheduleArray = [];
       this.organizerEmailScheduleArray = [];
    }

    /**
     * @description this method is responsible for scheduling all email events
     */
    scheduleAll() {
        this.eventService.getAllEventMailParams()
            .then(allEventEmailData => {
                allEventEmailData.each(eventEmailData => {
                    this.sendMailToAdmins(eventEmailData, 1, 'hour');
                    this.sendMailToAdmins(eventEmailData, 30, 'minutes');
                    this.sendMailToAdmins(eventEmailData, 15, 'minutes');
                    this.scheduleParticipantsEmail(eventEmailData, 15, 'minutes');
                    this.scheduleParticipantsEmail(eventEmailData, 10, 'minutes');
                });
            })
            .catch(error => {
                console.log(`Scheduler Error Message => ${error}`);
            })
    }

    /**
     * @description this function manages scheduling of emails to be sent to event Admins
     * @param {object} eventData
     * @param {integer} timeNumber
     * @param {string} timeUnit
     */
    sendMailToAdmins(eventData, timeNumber, timeUnit) {
        this.scheduleAdminsEmail(eventData, this.organizerEmailScheduleArray, timeNumber, timeUnit);
        this.scheduleAdminsEmail(eventData, this.eventAdminEmailScheduleArray, timeNumber, timeUnit);
    }

    /**
     * @description this function is used to schedule the sending of emails to event Admins
     * @param {object} event
     * @param {array} scheduledEventsArray
     * @param {integer} timeNumber
     * @param {string} timeUnit
     */
    scheduleAdminsEmail(event, scheduledEventsArray, timeNumber, timeUnit) {
        let eventData = event.attributes;
        let eventDate = new Date(moment(eventData.scheduled_at).subtract(timeNumber, timeUnit));
        scheduledEventsArray[eventData.id] = scheduler.scheduleJob(eventDate, ()=> {
            this.eventService.getAllEventMailData(eventData.id)
                .then(eventMailData => {
                    let organizerMail = eventMailData.organizer;
                    this.emailService.sendMailToEventHeads(role.ORGANIZER, organizerMail, eventData.title,
                        eventData.link,  `${timeNumber} + ${timeUnit}` )
                        .then(()=> {
                        console.log(`Email sent to the organizer of ${eventData.title}`);
                        });
                    eventMailData.eventAdmin.forEach(eventAdminMail => {
                        this.emailService.sendMailToEventHeads(role.EVENT_ADMIN, eventAdminMail, eventData.title,
                            eventData.link, 'one hour' )
                            .then(()=> {
                                console.log(`Email sent to the eventAdmin of ${eventData.title}`);
                            });
                    });
                })
                .catch(error => {
                    console.log(`Scheduler ${timeNumber} + ${timeUnit} Error => ${error}`);
                });
        });
    }

    /**
     * @description this function schedules email to be sent to all participant registered to an event
     * @param {object} event
     * @param {integer} timeNumber
     * @param {integer} timeUnit
     */
    scheduleParticipantsEmail(event, timeNumber, timeUnit) {
        let eventData = event.attributes;
        let eventDate = new Date(moment(eventData.scheduled_at).subtract(timeNumber, timeUnit));
        this.participantEmailScheduleArray[eventData.id] = scheduler.scheduleJob(eventDate, ()=> {
            this.eventService.getAllEventMailData(eventData.id)
                .then(eventMailData => {
                    eventMailData.participant.forEach(participantData => {
                        this.emailService.sendMailToEventParticipant(participantData.name, participantData.email,
                            eventData.title, eventData.link, `${timeNumber} + ${timeUnit}` )
                            .then(()=> {
                                console.log(`Email sent to the participant of ${eventData.title}`);
                            });
                    });
                })
                .catch(error => {
                    console.log(`Scheduler ${timeNumber} + ${timeUnit} Error => ${error}`);
                });
        });
    }

    /**
     * @description this function clears all schedules of organizer, participant and eventAdmins
     */
    clearAllSchedule(){
      this.participantEmailScheduleArray.forEach(
          participantMailSchedule => {
              participantMailSchedule.cancel();
          }
      );
      this.participantEmailScheduleArray.splice(0, this.participantEmailScheduleArray.length); //empty array content
      this.eventAdminEmailScheduleArray.forEach(
          eventAdminMailSchedule => {
              eventAdminMailSchedule.cancel();
          }
      );
      this.eventAdminEmailScheduleArray.splice(0, this.eventAdminEmailScheduleArray.length);
      this.organizerEmailScheduleArray.forEach(
          organizerMailSchedule => {
              organizerMailSchedule.cancel();
          }
      );
      this.organizerEmailScheduleArray.splice(0, this.organizerEmailScheduleArray.length);
    };

    /**
     * @description this function cancel the schedule of event mail-sending operations
     * @param {integer} eventId
     */
    cancelScheduledEvent(eventId) {
        this.participantEmailScheduleArray[eventId].cancel();
        this.eventAdminEmailScheduleArray[eventId].cancel();
        this.organizerEmailScheduleArray[eventId].cancel();
    }

    /**
     * @description this function starts the scheduler on starting the application
     * @description it also clears all the schedule and re-schedule every 12:00 in the morning
     */
    startScheduler() {
        console.log(`\n\nEVENT MAIL SCHEDULER STARTED AT ${moment().format('YYYY-MM-DD:HH:mm:ss')}\n\n`);
        this.clearAllSchedule();
        this.scheduleAll();
        scheduler.scheduleJob('0 0 * * *', ()=>{
            this.clearAllSchedule();
            this.scheduleAll();
        });
    }

    //TODO : write functions to handle deletion of events before the 12:00 hour routine update of schedules
}
module.exports = Scheduler;