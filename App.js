import React, { useState, useEffect } from 'react';
import { Button, Image, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function ImagePickerExample() {
	const [image, setImage] = useState(null);
	const [loading, setLoading] = useState(false);
	const [sended, setSended] = useState(false);

	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		console.log(result);

		if (!result.canceled) {
			let uri = result.assets[0].uri;
			setImage(uri);
		}
	};

	const sendImageToAPI = async () => {
		setLoading(true);
		let apiUrl = 'http://127.0.0.1:8000/api/upload';

		// upload the image
		let formData = new FormData();
		formData.append('image', { uri: image });

		fetch(apiUrl, {
			method: 'POST',
			body: formData,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'multipart/form-data',
			},
		})
			.then((response) => response.json())
			.then((json) => {
				console.log(json);
				setResults(json.results);
				if (json.results) {
					setSended(true);
				}
			}).catch((error) => {
				console.error(error);
			});
		setLoading(false);
	}


	// useEffect(() => {
	// 	sendImageToAPI()
	// }, [image])

	return (
		<View style={styles.container}>
			<View style={styles.action}>
				<TouchableOpacity style={styles.btn1} onPress={pickImage}>
					<Text style={styles.btn1Text}>Recuperer une image</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.btn2} onPress={sendImageToAPI}>
					<Text style={styles.btn2Text}>Enoyer</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.response}>
				{sended && (
					<>
						<Ionicons name="checkmark-circle" size={80} color="#0F730C" />
						<Text>Envoi effectuer</Text>
					</>
				)}
			</View>
			<View style={styles.viewer}>
				{loading && <ActivityIndicator size={'large'} color={'#0F730C'} />}
				{image && <Image source={{ uri: image }} style={styles.image} />}
			</View>

		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	action: {
		position: 'absolute',
		bottom: 10,
		flexDirection: 'row',
		alignContent: 'center',
		justifyContent: 'space-between'
	},
	response: {
		position: 'absolute',
		top: 30,
		alignContent: 'center',
		justifyContent: 'center',
		marginBottom: 20
	},
	btn1: {
		width: '40%',
		height: 75,
		borderColor: '#0F730C',
		borderWidth: 2,
		borderRadius: 30,
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 10
	},
	btn2: {
		width: '50%',
		height: 75,
		backgroundColor: '#0F730C',
		borderRadius: 30,
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 10
	},
	btn1Text: {
		color: '#0F730C',
		margin: 5
	},
	btn2Text: {
		color: '#FFF',
		fontSize: 18
	},
	image: {
		width: '100%',
		height: '100%',
	},
	viewer: {
		width: '80%',
		height: '50%',
		justifyContent: 'center',
		alignItems: 'center',
	}
});