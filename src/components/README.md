# WeProcess Components

This directory contains reusable components for the WeProcess application.

## InstructionsTable

A reusable table component for displaying instruction data with filtering, pagination, and status badges.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| data | Array | [] | Array of instruction objects to be displayed in the table |
| title | String | "Instructions In Progress" | Title displayed at the top of the table |
| subtitle | String | "Monthly instructions requested by firm" | Subtitle displayed below the title |

### Data Structure

Each object in the data array should have the following structure:

```js
{
  wpr: '5102', // String or Number (instruction ID)
  owner: 'Andrew Garfield', // String (owner name)
  serve: 'Serve to Alex', // String (service description)
  court: 'Court A', // String (court name)
  type: 'Urgent', // String (service type - "Urgent", "Medium", "Standard")
  deadline: '11/11/2022', // String (deadline date)
  status: '1st attempt' // String (status - "1st attempt", "2nd attempt", "3rd attempt", "In Transit")
}
```

### Example Usage

```jsx
import InstructionsTable from '../components/InstructionsTable';
import { instructionsTableData } from '../constants/mockData';

const YourComponent = () => {
  return (
    <div>
      <InstructionsTable 
        data={instructionsTableData} 
        title="Custom Title"
        subtitle="Custom subtitle text"
      />
    </div>
  );
};
```

### Features

1. Tab navigation for different instruction categories
2. Pagination with customizable items per page
3. Color-coded status badges
4. Responsive design
5. Clear entry count and pagination information 