// // import { useVideoPlayer, VideoView } from 'expo-video';
// import { useEffect, useRef, useState } from 'react';
// import { PixelRatio, StyleSheet, View, Button } from 'react-native';
// import { Video, ResizeMode } from "expo-av";
// // const videoSource =
// //   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

// export default function VideoScreen(videoSource) {
//     const ref = useRef(null);
//     const [isPlaying, setIsPlaying] = useState(true);
//     const player = useVideoPlayer(videoSource, (player) => {
//         player.loop = true;
//         player.play();
//     });

//     useEffect(() => {
//         const subscription = player.addListener('playingChange', (isPlaying) => {
//             setIsPlaying(isPlaying);
//         });

//         return () => {
//             subscription.remove();
//         };
//     }, [player]);

//     return (
//         <View style={styles.contentContainer}>
//            <Video
//             ref={ref}
//             source={{ uri: message.content }}
//             style={[
//               ,
//               isCurrentUser
//                 ? {
//                     alignSelf: "flex-end",
//                     maxWidth: "60%",
//                     borderRadius: 7,
//                     marginRight: 10,
//                     width: 320,
//                     height: 200,
//                   }
//                 : {
//                     alignSelf: "flex-start",
//                     maxWidth: "60%",
//                     marginLeft: 20,
//                     width: 320,
//                     height: 200,
//                   },
//             ]}
//             useNativeControls
//             resizeMode={ResizeMode.CONTAIN}
//             isLooping
//           />
//             <View style={styles.controlsContainer}>
//                 <Button
//                     title={isPlaying ? 'Pause' : 'Play'}
//                     onPress={() => {
//                         if (isPlaying) {
//                             player.pause();
//                         } else {
//                             player.play();
//                         }
//                         setIsPlaying(!isPlaying);
//                     }}
//                 />
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     contentContainer: {
//         flex: 1,
//         padding: 10,
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingHorizontal: 50,
//     },
//     video: {
//         width: 350,
//         height: 275,
//     },
//     controlsContainer: {
//         padding: 10,
//     },
// });
