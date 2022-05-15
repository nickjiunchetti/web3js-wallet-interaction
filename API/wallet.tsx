import Web3 from 'web3'
import { ABI } from './ABI'
import { userWallet } from './storage'

export const connectUserWallet = async () => {
	if (!window.ethereum) {
		alert('You need to install metamask to use this dApp')
		return
	}

	await window.ethereum.request({ method: 'eth_requestAccounts' })
	window.web3 = new Web3(window.ethereum)

	const balance = await getUserBalance()
	const userAccounts = await window.web3.eth.getAccounts()

	userWallet.set({ balance, account: userAccounts[0] })

	return true
}

export const getUserBalance = async () => {
	const userAccounts = await window.web3.eth.getAccounts()
	const ethBalance = await window.web3.eth.getBalance(userAccounts[0])

	const weenusAddress = '0x101848D5C5bBca18E6b4431eEdF6B95E9ADF82FA'

	const contract = new window.web3.eth.Contract(ABI.weenus, weenusAddress)
	const weenusBalance = await contract.methods
		.balanceOf(userAccounts[0])
		.call()

	return { eth: ethBalance, weenus: weenusBalance }
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
	value: number
) => {
	const gasPrice = await window.web3.eth.getGasPrice()

	const transactionObject = {
		from: senderAddress,
		to: receiverAddress,
		gasPrice: gasPrice,
		gas: 0,
		value: value * 10 ** 18
	}

	const gasLimit = await window.web3.eth.estimateGas(transactionObject)
	transactionObject.gas = gasLimit

	const transaction = await window.web3.eth.sendTransaction(transactionObject)

	// alert with transaction status(suceeded or failed)
	// update user wallet balance
	console.log(transaction)
}
