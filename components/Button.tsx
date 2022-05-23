type Props = {
	onClick: () => void
	children: React.ReactNode
	disabled?: boolean
	secondary?: boolean
	classes?: string
}

export default function Button({
	onClick,
	children,
	disabled,
	secondary = false,
	classes = ''
}: Props) {
	const primaryClasses = 'text-black bg-yellow-400 hover:bg-yellow-400/50'
	const secondaryClasses =
		'text-yellow-400 border border-yellow-400/70 hover:text-yellow-400/70 hover:border-yellow-400/30'
	return (
		<button
			className={`py-2 px-3 cursor-pointer rounded-md font-extrabold text-lg ${
				secondary ? secondaryClasses : primaryClasses
			} ${classes} ${disabled ? 'opacity-50' : ''}`}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	)
}
