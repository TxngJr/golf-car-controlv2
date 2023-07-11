import { TouchableOpacity, View, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import VoiceSvg from './assets/svgs/VoiceSvg';
import CarSvg from './assets/svgs/CarSvg';
import ClockSvg from './assets/svgs/ClockSvg';
import HomeScreen from './screens/HomeScreen';
import RecordingScreen from './screens/RecordingScreen';
import Voice from '@react-native-voice/voice';
import { ICar } from './interfaces/ICar';
import { getBatteryAndMapCar, putCar } from './apis/api';
import { IBatteryAdMapCar } from './interfaces/IBatteryAdMapCar';
import { enableLatestRenderer } from 'react-native-maps';

enableLatestRenderer();
type Props = {}

const App = (props: Props) => {
    const [isListening, setIsListening] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState('home');
    const [isUpdateCarDataProps, setIsUpdateCarDataProps] = useState<boolean>(true);
    const [batteryAndMapCarData, setBatteryAndMapCarData] = useState<IBatteryAdMapCar | null>(null);
    const [isLoadingMap, setIsLoadingMap] = useState<boolean>(true);
    const [checkBattery10, setCheckBattery10] = useState<boolean>(true);
    const [checkBattery0, setCheckBattery0] = useState<boolean>(true);
    const navigateToScreen = (screen: any) => {
        setActiveTab(screen);
    };

    useEffect(() => {
        Voice.onSpeechResults = (event: any) => {
            checkWord(event.value[0]);
        };

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    useEffect(() => {
        const fetchBatteryAndMapCarData = async () => {
            try {
                const batteryAndMapCar: IBatteryAdMapCar | null = await getBatteryAndMapCar();
                setBatteryAndMapCarData(batteryAndMapCar);
                setIsLoadingMap(false);
                if (batteryAndMapCar?.battery <= 10 && checkBattery10) {
                    Alert.alert('แบตเตอรี่ของคุณใกล้หมดแล้ว');
                    setCheckBattery10(false);
                } else if (batteryAndMapCar?.battery <= 0 && checkBattery0) {
                    Alert.alert('แบตเตอรี่ของคุณหมดแล้ว');
                    setCheckBattery0(false);
                } else if (batteryAndMapCar?.battery > 10 && !checkBattery10) {
                    setCheckBattery10(true);
                } else if (batteryAndMapCar?.battery > 0 && !checkBattery0) {
                    setCheckBattery0(true);
                }
            } catch (error) {
                console.error('Error fetching battery And Map Car data:', error);
            }
        };

        const intervalfetchBatteryAndMapCarData = setInterval(fetchBatteryAndMapCarData, 2000);
        fetchBatteryAndMapCarData();
        return () => {
            clearInterval(intervalfetchBatteryAndMapCarData);
        };
    }, [checkBattery10, checkBattery0]);


    const startListening = async () => {
        try {
            await Voice.start('th-TH');
            setIsListening(true);
        } catch (e) {
            console.error(e);
        }
    };

    const stopListening = async () => {
        try {
            await Voice.stop();
            setIsListening(false);
        } catch (e) {
            console.error(e);
        }
    };

    const handleStatusClick = async (field: keyof ICar, status: boolean) => {
        const updatedData = { [field]: status };
        try {
            await putCar(updatedData);
            setIsUpdateCarDataProps(true);
        } catch (error) {
            console.error(`Error updating ${field} status:`, error);
        }
    };

    const checkWord = (text: any) => {
        const words = text.split(' ');
        if (words.includes('เปิดรถ')) {
            handleStatusClick('isStart', true);
        } else if (words.includes('ปิดรถ')) {
            handleStatusClick('isStart', false);
        } else if (words.includes('เปิดไฟหน้า')) {
            handleStatusClick('frontLight', true);
        } else if (words.includes('ปิดไฟหน้า')) {
            handleStatusClick('frontLight', false);
        } else if (words.includes('เปิดไฟท้าย')) {
            handleStatusClick('backLight', true);
        } else if (words.includes('ปิดไฟท้าย')) {
            handleStatusClick('backLight', false);
        } else if (words.includes('เปิดไฟเลี้ยวซ้าย')) {
            handleStatusClick('leftLight', true);
        } else if (words.includes('ปิดไฟเลี้ยวซ้าย')) {
            handleStatusClick('leftLight', false);
        } else if (words.includes('เปิดไฟเลี้ยวขวา')) {
            handleStatusClick('rightLight', true);
        } else if (words.includes('ปิดไฟเลี้ยวขวา')) {
            handleStatusClick('rightLight', false);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                {activeTab === 'home' && <HomeScreen isUpdateCarDataProps={isUpdateCarDataProps} setIsUpdateCarDataProps={setIsUpdateCarDataProps} batteryAndMapCarData={batteryAndMapCarData} isLoadingMap={isLoadingMap} />}
                {activeTab === 'recordig' && <RecordingScreen />}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',backgroundColor: '#FFFFFF' }}>
                <View style={{ position: 'absolute', left: 0, right: 0, top: 10, bottom: 0, zIndex: 2 }}>
                    <View style={{ backgroundColor: "#000000", height: 2, width: 160, position: 'absolute', left: 15 }} />
                    <View style={{ backgroundColor: "#000000", height: 2, width: 160, position: 'absolute', right: 15 }} />
                </View>
                <View style={{ height: 44, width: 44, zIndex: 2 }}>
                    <TouchableOpacity onPress={() => navigateToScreen('home')} style={{ marginTop: 7 }}>
                        <CarSvg activeTabButtonText={activeTab === 'home' ? 'active' : 'notActive'} />
                    </TouchableOpacity>
                </View>
                <View style={{ width: 72, height: 72, alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                    <TouchableOpacity onPress={isListening ? stopListening : startListening} >
                        <VoiceSvg activeTabButtonText={isListening} />
                    </TouchableOpacity>
                </View>
                <View style={{ height: 44, width: 44, zIndex: 2 }}>
                    <TouchableOpacity onPress={() => navigateToScreen('recordig')} style={{ marginTop: 8 }}>
                        <ClockSvg activeTabButtonText={activeTab === 'recordig' ? 'active' : 'notActive'} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default App