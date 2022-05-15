type Props = {
	onClick: () => void
	children: React.ReactNode
	classes?: string
	disabled?: boolean
}

export default function Button({
	onClick,
	children,
	classes,
	disabled
}: Props) {
	return (
		<button
			className={`py-2 px-3 rounded-md text-black font-bold bg-yellow-400 hover:bg-yellow-500 ${classes}`}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	)
}
