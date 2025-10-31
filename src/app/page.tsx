import Button from '@/components/Button'

export default function Home (): React.ReactNode {
  return (
    <div className='font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20'>
      <main className='flex flex-col gap-[32px] row-start-2 items-center sm:items-start'>
        <h1>Hello World</h1>
        <Button size='sm'>Click me</Button>
        <Button size='md'>Click me</Button>
        <Button size='lg'>Click me</Button>
        <Button size='xl'>Click me</Button>
        <Button variant='ghost'>Click me</Button>
        <Button variant='underline'>Click me</Button>
        <Button variant='outline'>Click me</Button>
        <Button disabled>Click me</Button>
      </main>
    </div>
  )
}
