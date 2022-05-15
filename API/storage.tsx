const setStorageData = (storageKey: string, data: any) => {
	sessionStorage.setItem(storageKey, JSON.stringify(data))
}

const getStorageData = (storageKey: string) => {
	const userAccount = JSON.parse(sessionStorage.getItem(storageKey) || '')
	return userAccount
}

export const userWallet = {
	set: (data: any) => setStorageData('userWallet', data),
	get: () => getStorageData('userWallet'),
	remove: () => sessionStorage.removeItem('userWallet')
}
