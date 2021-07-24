import {
    Defs,
    G,
    Image,
    Page,
    Polygon,
    Rect,
    StyleSheet,
    Svg,
    Text,
    View
} from '@react-pdf/renderer';

import PdfLogo from '../assets/pdf-logo.png';

export const FrontPage = () => {
    return (
        <Page style={{ position: 'relative', top: 0, left: 0 }}>
            <Svg>
                <G fill-opacity="0.1">
                    <Polygon fill="#444" points="90 150 0 300 180 300" />
                    <Polygon points="90 150 180 0 0 0" />
                    <Polygon fill="#AAA" points="270 150 360 0 180 0" />
                    <Polygon fill="#DDD" points="450 150 360 300 540 300" />
                    <Polygon fill="#999" points="450 150 540 0 360 0" />
                    <Polygon points="630 150 540 300 720 300" />
                    <Polygon fill="#DDD" points="630 150 720 0 540 0" />
                    <Polygon fill="#444" points="810 150 720 300 900 300" />
                    <Polygon fill="#FFF" points="810 150 900 0 720 0" />
                    <Polygon fill="#DDD" points="990 150 900 300 1080 300" />
                    <Polygon fill="#444" points="990 150 1080 0 900 0" />
                    <Polygon fill="#DDD" points="90 450 0 600 180 600" />
                    <Polygon points="90 450 180 300 0 300" />
                    <Polygon fill="#666" points="270 450 180 600 360 600" />

                    <Polygon fill="#AAA" points="990 450 900 600 1080 600" />
                    <Polygon fill="#444" points="990 450 1080 300 900 300" />
                    <Polygon fill="#222" points="90 750 0 900 180 900" />
                    <Polygon points="270 750 180 900 360 900" />
                    <Polygon fill="#DDD" points="270 750 360 600 180 600" />
                    <Polygon points="450 750 540 600 360 600" />
                    <Polygon points="630 750 540 900 720 900" />
                    <Polygon fill="#444" points="630 750 720 600 540 600" />
                    <Polygon fill="#AAA" points="810 750 720 900 900 900" />
                    <Polygon fill="#666" points="810 750 900 600 720 600" />
                    <Polygon fill="#999" points="990 750 900 900 1080 900" />
                    <Polygon fill="#999" points="180 0 90 150 270 150" />
                    <Polygon fill="#444" points="360 0 270 150 450 150" />
                    <Polygon fill="#FFF" points="540 0 450 150 630 150" />
                    <Polygon points="900 0 810 150 990 150" />
                    <Polygon fill="#222" points="0 300 -90 450 90 450" />
                    <Polygon fill="#FFF" points="0 300 90 150 -90 150" />
                    <Polygon fill="#FFF" points="180 300 90 450 270 450" />
                    <Polygon fill="#666" points="180 300 270 150 90 150" />
                    <Polygon fill="#222" points="360 300 270 450 450 450" />
                    <Polygon fill="#FFF" points="360 300 450 150 270 150" />
                    <Polygon fill="#444" points="540 300 450 450 630 450" />
                    <Polygon fill="#222" points="540 300 630 150 450 150" />
                    <Polygon fill="#AAA" points="720 300 630 450 810 450" />
                    <Polygon fill="#666" points="720 300 810 150 630 150" />
                    <Polygon fill="#FFF" points="900 300 810 450 990 450" />
                    <Polygon fill="#999" points="900 300 990 150 810 150" />
                    <Polygon points="0 600 -90 750 90 750" />
                    <Polygon fill="#666" points="0 600 90 450 -90 450" />
                    <Polygon fill="#AAA" points="180 600 90 750 270 750" />
                    <Polygon fill="#444" points="180 600 270 450 90 450" />
                    <Polygon fill="#444" points="360 600 270 750 450 750" />
                    <Polygon fill="#999" points="360 600 450 450 270 450" />
                    <Polygon fill="#666" points="540 600 630 450 450 450" />
                    <Polygon fill="#222" points="720 600 630 750 810 750" />
                    <Polygon fill="#FFF" points="900 600 810 750 990 750" />
                    <Polygon fill="#222" points="900 600 990 450 810 450" />
                    <Polygon fill="#DDD" points="0 900 90 750 -90 750" />
                    <Polygon fill="#444" points="180 900 270 750 90 750" />
                    <Polygon fill="#FFF" points="360 900 450 750 270 750" />
                    <Polygon fill="#AAA" points="540 900 630 750 450 750" />
                    <Polygon fill="#FFF" points="720 900 810 750 630 750" />
                    <Polygon fill="#222" points="900 900 990 750 810 750" />
                    <Polygon fill="#222" points="1080 300 990 450 1170 450" />
                    <Polygon fill="#FFF" points="1080 300 1170 150 990 150" />
                    <Polygon points="1080 600 990 750 1170 750" />
                    <Polygon fill="#666" points="1080 600 1170 450 990 450" />
                    <Polygon fill="#DDD" points="1080 900 1170 750 990 750" />
                </G>
                <Rect x="0" y="0" fill="url(#a)" width="100%" height="100%" />
                <Rect x="0" y="0" fill="url(#b)" width="100%" height="100%" />
            </Svg>
            <View
                style={{
                    display: 'flex',
                    position: 'absolute',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    top: 0,
                    left: 0,
                    height: '29cm',
                    border: '3px solid red'
                }}>
                <View style={styles.text}>
                    <Text style={styles.title}>{'Rapport '}</Text>
                    <Text style={styles.title}>{'3. Partskontroll'}</Text>
                </View>
                <View>
                    <Image style={styles.logo} src={PdfLogo} />
                </View>
                <View style={[styles.text, styles.subText]}>
                    <Text>Dato</Text>
                    <Text>Den elektriske installasjon er vurdert av:</Text>
                    <Text>User</Text>
                </View>
            </View>
        </Page>
    );
};

const styles = StyleSheet.create({
    logo: {
        marginHorizontal: 150
    },
    title: {
        fontSize: '60px'
    },
    subText: {
        fontSize: '30px'
    },
    text: {
        alignItems: 'center'
    }
});
