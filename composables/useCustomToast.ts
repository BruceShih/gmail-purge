export function useCustomToast() {
  const toast = useToast()

  const show = (title: string, status: 'success' | 'error' | 'warning' | 'info') => {
    switch (status) {
      case 'success':
        toast.add({ title, icon: 'i-lucide-check', color: 'green' })
        break
      case 'error':
        toast.add({ title, icon: 'i-lucide-x', color: 'red' })
        break
      case 'warning':
        toast.add({ title, icon: 'i-lucide-warning', color: 'orange' })
        break
      case 'info':
        toast.add({ title, icon: 'i-lucide-info', color: 'blue' })
        break
    }
  }

  return { show }
}
