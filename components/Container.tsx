type Props = {
	children: React.ReactNode
	classes?: string
}

export default function Button({ children, classes = '' }: Props) {
	return (
		<main className={`py-8 px-6 bg-gray-900 ${classes}`}>{children}</main>
	)
}
