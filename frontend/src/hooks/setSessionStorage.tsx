import { useEffect, useState } from 'react'

export const useSessionStorage = (storageKey: string, fallbackState: any) => {
	const [value, SetValue] = useState(fallbackState)

	useEffect(() => {
		SetValue(sessionStorage.getItem(storageKey) || fallbackState)
	}, [])

	useEffect(() => {
		if (typeof value === 'object' && value !== null) {
			sessionStorage.setItem(storageKey, JSON.stringify(value))
		} else {
			sessionStorage.setItem(storageKey, value)
		}
	}, [value, SetValue])

	return [value, SetValue]
}
