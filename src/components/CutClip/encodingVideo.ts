import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

type EncodingVideoProps = {
  videoUri: string;
  startTime: string;
  enCodingDuration: string;
};

export const encodingVideo = async ({
  videoUri,
  startTime,
  enCodingDuration,
}: EncodingVideoProps) => {
  console.log('DURATION: ', startTime, enCodingDuration);
  //TODO: handle loading here
  const outputFile = `file:///data/user/0/com.cutclip/cache/rn_image_picker_lib_temp_${Math.random()}.mp4`;

  const command = `-ss ${startTime} -i ${videoUri} -to ${enCodingDuration} -c:v libx264 -crf 18 -c:a aac ${outputFile}`;
  // ffmpeg -ss [start_time] -i [input_file] -to [duration] -c:v libx264 -preset veryslow -crf 18 -c:a copy [output_file]
  //ffmpeg -ss [start_time] -i [input_file] -to [duration] -c:v libx264 -crf 18 -c:a aac [output_file]

  try {
    const session = await FFmpegKit.execute(command);
    const returnCode = await session.getReturnCode();

    if (ReturnCode.isSuccess(returnCode)) {
      console.log('Cutting video succeeded!', returnCode);
      try {
        const res = await CameraRoll.saveAsset(outputFile, {
          type: 'video',
          album: 'CutClip',
        });

        return res.node.image.uri;
      } catch (err) {
        console.log('Video save failed!', err);
        return '';
      }
    } else if (ReturnCode.isCancel(returnCode)) {
      console.log('Cutting video cancelled!');
      return '';
    } else {
      console.log(`Cutting video failed with returnCode=${returnCode}.`);
      return '';
    }
  } catch (error) {
    console.error('Error executing FFmpegKit or saving the video', error);
    return '';
  }
};
