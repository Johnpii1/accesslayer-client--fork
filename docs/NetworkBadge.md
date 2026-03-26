# NetworkBadge Component

A compact, reusable badge component for displaying the active Stellar network environment (testnet or mainnet).

## Features

- Compact design suitable for headers and transaction surfaces
- Support for testnet and mainnet states
- Optional status indicator dot
- Dark mode support
- Fully accessible with ARIA labels
- Consistent styling with the rest of the application

## Usage

```tsx
import { NetworkBadge } from '@/components/common/NetworkBadge';

// Basic usage - testnet (default)
<NetworkBadge />

// Mainnet
<NetworkBadge network="mainnet" />

// Without indicator dot
<NetworkBadge network="testnet" showIndicator={false} />

// With custom className
<NetworkBadge network="mainnet" className="ml-4" />
```

## Props

| Prop            | Type                     | Default     | Description                              |
| --------------- | ------------------------ | ----------- | ---------------------------------------- |
| `network`       | `'testnet' \| 'mainnet'` | `'testnet'` | The network type to display              |
| `showIndicator` | `boolean`                | `true`      | Whether to show the status indicator dot |
| `className`     | `string`                 | `undefined` | Additional CSS classes to apply          |

## Examples

### In a Header

```tsx
import { NetworkBadge } from '@/components/common/NetworkBadge';

function AppHeader() {
	const currentNetwork = import.meta.env.VITE_STELLAR_NETWORK || 'testnet';

	return (
		<header className="flex items-center justify-between p-4">
			<h1>My Stellar App</h1>
			<NetworkBadge network={currentNetwork as 'testnet' | 'mainnet'} />
		</header>
	);
}
```

### In a Transaction Surface

```tsx
import { NetworkBadge } from '@/components/common/NetworkBadge';

function TransactionCard({ transaction }) {
	return (
		<div className="card">
			<div className="flex items-center justify-between">
				<h3>Transaction Details</h3>
				<NetworkBadge network="mainnet" />
			</div>
			{/* Transaction details */}
		</div>
	);
}
```

## Styling

The component uses Tailwind CSS classes and supports both light and dark modes:

- **Testnet**: Yellow color scheme (bg-yellow-100/dark:bg-yellow-900/30)
- **Mainnet**: Green color scheme (bg-green-100/dark:bg-green-900/30)

## Accessibility

- Uses semantic HTML with `role="status"`
- Includes `aria-label` for screen readers
- Indicator dot marked as `aria-hidden` to avoid redundant announcements
