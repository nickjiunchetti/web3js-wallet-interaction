import Web3 from 'web3'
import { ABI } from './ABI'

export const connectUserWallet = async () => {
	if (!window.ethereum) {
		alert('You need to install metamask to use this dApp')
		return
	}

	await window.ethereum.request({ method: 'eth_requestAccounts' })
	window.web3 = new Web3(window.ethereum)

	const userAccounts = await window.web3.eth.getAccounts()
	const balance = await getUserBalance(userAccounts[0])

	return { connected: true, balance, account: userAccounts[0] }
}

export const getUserBalance = async (userAccount: string) => {
	const ethBalance = await window.web3.eth.getBalance(userAccount)

	const weenusAddress = '0x101848D5C5bBca18E6b4431eEdF6B95E9ADF82FA'

	// const contract = new window.web3.eth.contract(ABI.weenus, weenusAddress)
	// const weenusBalance = await contract.methods
	// 	.balanceOf(userAccounts[0])
	// 	.call()

	return { eth: ethBalance, weenus: 0 }
}

export const getTransactionFee = async (
	senderAddress: string,
	receiverAddress: string
) => {
	const gasPrice = await window.web3.eth.getGasPrice()

	const transactionObject = {
		from: senderAddress,
		to: receiverAddress,
		gasPrice: gasPrice
	}

	const gasLimit = await window.web3.eth.estimateGas(transactionObject)
	const transactionFee = gasPrice * gasLimit

	return transactionFee
}

export const sendTransaction = async (
	senderAddress: string,
	receiverAddress: string,
	value: number,
	onTransactionHash: (hash: string) => void,
	onTransactionReceipt: (hash: string) => void,
	onTransactionError: (code: number, message: string) => void
) => {
	const transactionObject = {
		from: senderAddress,
		to: receiverAddress,
		value: value * 10 ** 18
	}

	window.web3.eth
		.sendTransaction(transactionObject)
		.on('transactionHash', (hash: string) => {
			onTransactionHash(hash)
		})
		.on('receipt', async (receipt: { transactionHash: string }) => {
			onTransactionReceipt(receipt.transactionHash)
		})
		.on('error', ({ code, message }: { code: number; message: string }) => {
			onTransactionError(code, message)
		})
}
