// Simple event emitter for refreshing pending approvals count
class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    off(event, listenerToRemove) {
        if (!this.events[event]) return;
        
        this.events[event] = this.events[event].filter(
            listener => listener !== listenerToRemove
        );
    }

    emit(event, data) {
        if (!this.events[event]) return;
        
        this.events[event].forEach(listener => {
            listener(data);
        });
    }
}

export const appEvents = new EventEmitter();

// Event types
export const EVENT_TYPES = {
    APPROVAL_UPDATED: 'approval_updated',
    EXPENSE_CREATED: 'expense_created',
    EXPENSE_SUBMITTED: 'expense_submitted'
};
