import { prisma } from '@/lib/prisma'
import SettingsClient from './components/SettingsClient'

export default async function SettingsPage() {
  // Grab the global settings row, or null if it hasn't been created yet
  const settings = await prisma.storeSettings.findFirst()

  return <SettingsClient settings={settings} />
}