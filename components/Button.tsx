type Props = {
	onClick: () => void
	children: React.ReactNode
	disabled?: boolean
	classes?: string
}

export default function Button({
	onClick,
	children,
	disabled,
	classes = ''
}: Props) {
	return (
		<button
			className={`py-2 px-3 cursor-pointer rounded-md text-black font-extrabold text-lg bg-yellow-400 hover:bg-yellow-400/50 ${classes} ${
				disabled ? 'opacity-50' : ''
			}`}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	)
}
