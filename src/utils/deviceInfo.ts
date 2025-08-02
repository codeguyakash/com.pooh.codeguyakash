import DeviceInfo from 'react-native-device-info';

interface DeviceInfoType {
  device_id: string | null;
  device_platform: string;
  device_build: string;
  device_p_name: string;
  device_model: string;
  device_version: string;
  device_serial: string;
  device_uuid: string;
  device_manufacturer: string;
  total_memory: string;
  free_disk_storage: string;
  total_disk_capacity: string;
}

const formatBytesToGB = (bytes: number): string => {
  return (bytes / 1024 ** 3).toFixed(2) + 'GB';
};

export const getDeviceInfo = async (): Promise<DeviceInfoType> => {
  return {
    device_id: await DeviceInfo.getDeviceId(),
    device_platform: DeviceInfo.getSystemName(),
    device_build: await DeviceInfo.getBuildNumber(),
    device_p_name: DeviceInfo.getApplicationName(),
    device_model: DeviceInfo.getModel(),
    device_version: DeviceInfo.getSystemVersion(),
    device_serial: await DeviceInfo.getSerialNumber(),
    device_uuid: await DeviceInfo.getUniqueId(),
    device_manufacturer: await DeviceInfo.getManufacturer(),
    total_memory: formatBytesToGB(await DeviceInfo.getTotalMemory()),
    free_disk_storage: formatBytesToGB(await DeviceInfo.getFreeDiskStorage()),
    total_disk_capacity: formatBytesToGB(
      await DeviceInfo.getTotalDiskCapacity()
    ),
  };
};
