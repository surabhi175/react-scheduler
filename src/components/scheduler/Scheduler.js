import React, { useState, useEffect, Component } from 'react'
import 'dhtmlx-scheduler';
import 'dhtmlx-scheduler/codebase/dhtmlxscheduler_material.css';
import 'dhtmlx-scheduler/codebase/dhtmlxscheduler_terrace.css';

import './Scheduler.css';


const scheduler = window.scheduler;

export default class Scheduler extends Component {

    initSchedulerEvents() {
        if (scheduler._$initialized) {
            return;
        }
        const onDataUpdated = this.props.onDataUpdated;

        scheduler.attachEvent('onEventAdded', (id, ev) => {
            if (onDataUpdated) {
                onDataUpdated('created', ev, id)
                var calEvents = {events: scheduler.getEvents()}
                window.localStorage.setItem('events',JSON.stringify(calEvents))
            }
        });

        scheduler.attachEvent('onEventChanged', (id, ev) => {
            if (onDataUpdated) {
                onDataUpdated('updated', ev, id);
                var calEvents = {events: scheduler.getEvents()}
                window.localStorage.setItem('events',JSON.stringify(calEvents))
            }
        });

        scheduler.attachEvent('onEventDeleted', (id, ev) => {
            if (onDataUpdated) {
                onDataUpdated('deleted', ev, id);
                var calEvents = {events: scheduler.getEvents()}
                window.localStorage.setItem('events',JSON.stringify(calEvents))
            }
        });
        scheduler._$initialized = true;

    }

    componentDidMount() {
        scheduler.skin = 'terrace';
        scheduler.config.header = [
            'day',
            'week',
            'month',
            'date',
            'prev',
            'today',
            'next'
        ];

        this.initSchedulerEvents();

        const { events } = this.props;
        scheduler.init(this.schedulerContainer, Date.now());
       
        var bleh = JSON.parse(window.localStorage.getItem('events'));

        if (bleh){
            scheduler.parse(bleh.events);
             console.log(scheduler.getEvents());
            var calEvents = {events: scheduler.getEvents()}
            window.localStorage.setItem('events',JSON.stringify(calEvents))
        } else {
            scheduler.parse(events);
            var calEvents = {events: scheduler.getEvents()}
            window.localStorage.setItem('events',JSON.stringify(calEvents))
        }
        
    }

    render() {
        return (
            <div
                ref={(input) => { this.schedulerContainer = input }}
                style={{ width: '100%', height: '100%' }}
            ></div>
        );
    }
}
