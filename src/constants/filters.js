export const IntervalFilters = [
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Yearly', value: 'yearly' }
];

export const defaultIntervalFilter = IntervalFilters[2].value;

export const InstructionsTableStatusFilters = [
    { id: 'new-requests', label: 'New requests' },
    { id: 'in-progress', label: 'In progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'invoices', label: 'Invoices' }
];