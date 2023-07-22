import { useEffect, useState } from 'react'

export const useSessionStorage = (storageKey: string, fallbackState: any) => {
	const [value, SetValue] = useState(fallbackState)

	useEffect(() => {
		SetValue(sessionStorage.getItem(storageKey))
	}, [])

	useEffect(() => {
		sessionStorage.setItem(storageKey, JSON.stringify(value))
	}, [value, SetValue])

	return [value, SetValue]
}
