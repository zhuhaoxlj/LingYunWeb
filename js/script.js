class PlayerWidget {
    constructor(player, tracks) {
        // State

        this.current = 0
        this.next = 0
        this.currentImage = 0
        this.tracks = tracks
        this.player = player
        this.isPaused = false
        this.interval = null
        // DOM
        this.progressBar = this.player.querySelector('.c-player__ui__seek__seeker div')
        this.progress = this.player.querySelector('.c-player__ui__seek__seeker')
        this.playBtn = this.player.querySelector('.c-player__ui__play')
        this.pauseBtn = this.player.querySelector('.c-player__ui__pause')
        this.pauseSvgs = this.pauseBtn.querySelectorAll('svg')
        this.prevBtn = this.player.querySelector('.c-player__ui__prev')
        this.nextBtn = this.player.querySelector('.c-player__ui__next')
        this.dots = this.player.querySelectorAll('.c-player__ui__dots__dot')
        this.bindEvents()
    }

    bindEvents() {
        this.nextBtn.addEventListener('click', e => this.nextTrack(e))
        this.prevBtn.addEventListener('click', e => this.prevTrack(e))
        this.playBtn.addEventListener('click', () => this.playTrack())
        this.pauseBtn.addEventListener('click', () => this.pauseTrack())
    }

    playTrack() {
        this.tiltX()

        this.tl
            .set(this.pauseBtn, {
                transformPerspective: 1000,
                rotationY: 45,
                rotationX: -45,
                scale: .8
            })
            .to(this.playBtn, .2, {
                y: 8,
                yoyo: true,
                ease: Sine.easeInOut,
                repeat: 1
            }, 0)

            // Dots
            .set(this.dots, {autoAlpha: 1})
            .to(this.dots[1], .5, {
                y: 35,
                scale: .4,
                onComplete: () => {
                    this.tl.set(this.dots, {autoAlpha: 0})
                    this.play()
                },
                ease: Sine.easeIn
            }, .65)
            .to(this.dots[2], .9, {
                y: 35,
                scale: .7,
                ease: Power4.easeIn
            }, 0)
            .to(this.dots[3], .9, {
                y: 15,
                scaleX: 0,
                scaleY: 2,
                ease: Power4.easeIn
            }, 0)
            
    }

    pauseTrack() {
        // var oAudio = document.getElementById('audio');
        oAudio.pause();
        clearInterval(Interval)
        this.isPaused = true
        this.tiltX()
        this.tl
            .set(this.playBtn, {rotation: -45})
            .to(this.pauseSvgs[0], .25, {
                y: 4,
                yoyo: true,
                repeat: 1,
                ease: Sine.easeInOut
            })
            .to(this.playBtn, .3, {
                rotation: 0,
                scale: 1,
                ease: Power4.easeIn,
                autoAlpha: .9
            }, .9)
            .to(this.pauseBtn, .1, {autoAlpha: 0}, 1)
            .to(this.progress, .7, {
                width: '0%',
                ease: Power4.easeOut
            }, .8)
            .to(this.pauseSvgs[1], .2, {autoAlpha: 0}, .9)
            .to(this.progress, .6, {
                alpha: 0,
                ease: Power4.easeInOut
            }, .8)
            .set(this.dots, {autoAlpha: 1}, 1.1)
            .to(this.dots[2], .6, {
                y: '-=35',
                scale: 1,
                ease: Power4.ease
            }, 1.1)
            .to(this.dots[1], .6, {
                y: '-=35',
                scale: 1,
                ease: Power4.ease,
                onComplete: () => this.tl.set(this.dots, {autoAlpha: 0})
            }, 1.1)
            .set(this.dots[3], {
                y: "-=15",
                scaleX: 1,
                scaleY: 1,
                ease: Power4.ease
            })
            .to(this.player, .6, {
                paddingBottom: '.4rem'
            }, 1)
    }

    nextTrack(e) {
        if(musicnum<musicList.length)
            musicnum++
        if(musicnum==musicList.length)
            musicnum=0
        oAudio.src = './bgm/' + musicList[musicnum]
        clearInterval(Interval);
        rotateval=0;
        this.play()
        this.incrementNextTrack()
            .animatePrevNext(e)
            .tiltY('right')
            .rewind()
            .changeImage('+')
    }

    prevTrack(e) {
        if(musicnum>0)
            musicnum--
        oAudio.src = './bgm/' + musicList[musicnum]
        clearInterval(Interval)
        rotateval=0;
        this.play()
        this.decrementNextTrack()
            .animatePrevNext(e)
            .tiltY('left')
            .rewind()
            .changeImage('-')
    }

    play() {
        // var htmlobj=$.ajax({url:"http://mark.abdwhp.cn/album.php",async:false});
        // alert(html(htmlobj.responseText));
        clearInterval(Interval)
        rotate();
        this.tl
            .set(this.pauseSvgs[1], {scale: 0})
            .set(this.progress, {alpha: 1})
            .to(this.progress, .8, {
                width: '100%',
                ease: Power4.easeOut,
                onComplete: () => {
                    this.isPaused = false
                    this.setInterval()
                }
            }, 0)
            .to(this.playBtn, .3, {
                rotation: -30,
                scale: .8,
                ease: Power4.easeIn,
                autoAlpha: 0
            }, .25)
            .to(this.pauseBtn, .1, {
                scale: 1,
                rotationY: 0,
                rotationX: 0,
                autoAlpha: 1,
                onComplete: () => {
                    this.tl
                        .set(this.pauseBtn, {
                            rotationY: 0,
                            rotationX: 0,
                            scale: 1
                        })
                }
            }, 0.35)
            .to(this.pauseSvgs[1], .3, {
                scale: 1,
                autoAlpha: 1,
                ease: Back.easeOut
            }, .5)
            .to(this.player, .6, {
                paddingBottom: '2rem'
            }, 0.2)
        oAudio.play();
    }

    rewind() {
        this.tl.to(this.progressBar, .5, {width: '-2%'})
        return this
    }

    incrementNextTrack() {
        if (this.current >= (this.tracks.length - 1)) {
            this.next = -1
        }
        this.next++
        return this
    }

    decrementNextTrack() {
        if (this.current <= 0) {
            this.next = this.tracks.length
        }
        this.next--
        return this
    }

    animatePrevNext(e) {
        const icons = e.currentTarget.querySelectorAll('svg')

        this.tl
            .set(icons, {scale: 1, alpha: .6})
            .to(icons[1], .18, {
                scale: .8,
                repeat: 1,
                alpha: 1,
                yoyo: true
            })
            .to(icons[0], .18, {
                scale: .8,
                alpha: 1,
                repeat: 1,
                yoyo: true
            }, '-=.22')

        return this
    }

    tiltY(side) {
        this.tl
            .set(".c-player", {
                transformPerspective: 1000,
                transformStyle: "preserve-3d",
                rotationY: 0
            })
            .to('.c-player', .25, {
                rotationY: side === 'right' ? 8 : -8,
                ease: Sine.easeInOut,
                yoyo: true,
                repeat: 1
            }, 0)

        return this
    }

    tiltX() {
        this.tl
            .set(this.player, {
                transformPerspective: 1000,
                rotationX: 0,
                rotationY: 0
            })
            .to(this.player, .25, {
                rotationX: -4,
                ease: Sine.easeInOut,
                yoyo: true,
                repeat: 1
            })
    }

    changeImage(direction) {
        let images = this.player.querySelectorAll('img'),
            current = this.currentImage % 2

        images[1 - current].src = this.tracks[this.next].image

        this.tl
            .set('.c-player__picture__images', {rotation: 0})
            .to('.c-player__picture__images', 1.8, {
                rotation: direction + '=360',
                ease: Back.easeOut
            })
            .to(images[current], 1.8, {alpha: 0, ease: Expo.easeOut}, 0)
            .to(images[1 - current], 1.8, {
                alpha: 1,
                ease: Expo.easeOut
            }, 0)

        this.updateTrackName()
        this.updateBackground()

        // Set props for next transition
        this.current = this.next
        this.currentImage = ++this.currentImage % 2
    }

    updateTrackName() {
        this.tl
            .to('.c-player__details strong', .3, {
                delay: .2,
                alpha: 0,
                scale: 0,
                ease: Back.easeIn,
                onComplete: timeline => {
                    var singer = musicList[musicnum].split('-')[0]
                    // timeline.target[0].innerText = this.tracks[this.next].artist
                    timeline.target[0].innerText = singer
                    this.tl.to(timeline.target[0], .25, {
                        scale: 1,
                        delay: .1,
                        alpha: 1,
                        ease: Back.easeInOut
                    })
                },
                onCompleteParams: ['{self}']
            })
            .to('.c-player__details span', .25, {
                alpha: 0,
                onComplete: timeline => {
                    // timeline.target[0].innerText = this.tracks[this.next].name
                    var songname = musicList[musicnum].split('-')[1].replace(".mp3","").split('[')[0]
                    timeline.target[0].innerText = songname

                    this.tl.to(timeline.target[0], .2, {alpha: 1})
                },
                onCompleteParams: ['{self}']
            }, .5)
    }

    updateBackground() {
        const gradient = this.tracks[this.next].gradient

        this.tl
            .to('.o-background', 1.5, {
                'background-image': 'linear-gradient(to right top, ' + gradient + ')',
                ease: Sine.easeOut
            })
    }

    setInterval() {
        if (this.interval !== null) {
            return
        }
        this.interval = setInterval(() => {
            if (this.isPaused === false) {
                this.tl.to(this.progressBar, 0.2, {width: '+=1%'})
            }
        }, processtime)
    }

    get tl() {
        return new TimelineLite()
    }
}



const tracks = [
    {
        artist: '蓝绿到紫色',
        name: 'Rakuta (Official Single)',
        // image: 'img/1.jpg',
        gradient: '#2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%'
    }, 
    {
        artist: '薄荷绿到粉红色',
        name: 'Rakuta (Official Single)',
        // image: 'img/1.jpg',
        gradient: ' #a8edea, #fed6e3'
    }, 
    {
        artist: '蓝色到白色',
        name: 'Tied up feat. Steven Clavier',
        // image: 'img/2.jpg',
        gradient: '#8bd0ff, #a4daff, #bbe3ff, #d2edff, #e8f6ff'
    }, 
    {
        artist: '紫色粉色黄色',
        name: 'A great dribble shot',
        // image: 'img/3.jpg',
        gradient: '#ffaff1, #ffb5cb, #ffc8ae, #ffe1a6, #f0f8b8'
    },
    {
        artist: '紫色到蓝色',
        name: 'A great dribble shot',
        // image: 'img/3.jpg',
        gradient: '#ffc4ee, #ead1fc, #dadcff, #d5e5fb, #dceaf3'
    },
    {
        artist: '黄绿色渐变',
        name: 'A great dribble shot',
        // image: 'img/3.jpg',
        gradient: '#fddb92,#d1fdff'
    },
    {
        artist: '蓝色到很浅的粉色',
        name: 'A great dribble shot',
        // image: 'img/3.jpg',
        gradient: '#fff1eb,#ace0f9'
    },
    {
        artist: '浅黄色和浅粉色',
        name: 'A great dribble shot',
        // image: 'img/3.jpg',
        gradient: '#e9defa,#fbfcdb'
    },
    {
        artist: 'The Glyph',
        name: 'A great dribble shot',
        // image: 'img/3.jpg',
        gradient: '#f3e7e9,#e3eeff'
    },
    {
        artist: 'The Glyph',
        name: 'A great dribble shot',
        // image: 'img/3.jpg',
        gradient: '#dad4ec,#f3e7e9'
    },
    {
        artist: 'The Glyph',
        name: 'A great dribble shot',
        // image: 'img/3.jpg',
        gradient: '#fad0c4 0%, #ffd1ff 100%'
    },
    {
        artist: 'The Glyph',
        name: 'A great dribble shot',
        // image: 'img/3.jpg',
        gradient: '#fbc2eb 0%, #a6c1ee 100%'
    },
    {
        artist: 'The Glyph',
        name: 'A great dribble shot',
        // image: 'img/3.jpg',
        gradient: ' #fdcbf1 0%, #fdcbf1 1%, #e6dee9 100%'
    },
    {
        artist: 'The Glyph',
        name: 'A great dribble shot',
        // image: 'img/3.jpg',
        gradient: '#e0c3fc 0%, #8ec5fc 100%'
    },
    // {
        //     artist: '！！！亮蓝色谨慎使用！！！',
        //     name: 'A great dribble shot',
        //     // image: 'img/3.jpg',
        //     gradient: '#4facfe 0%, #00f2fe 100%'
        // },
    {
        artist: '黯淡的紫色过度到黄色，颜色比较安静不鲜艳',
        name: 'A great dribble shot',
        // image: 'img/3.jpg',
        gradient: '#d299c2 0%, #fef9d7 100%'
    },
    {
        artist: 'The Glyph',
        name: 'A great dribble shot',
        // image: 'img/3.jpg',
        gradient: '#89f7fe 0%, #66a6ff 100%'
    },
    {
        artist: 'The Glyph',
        name: 'A great dribble shot',
        // image: 'img/3.jpg',
        gradient: '#fdfcfb 0%, #e2d1c3 100%'
    },
    {
        artist: 'The Glyph',
        name: 'A great dribble shot',
        // image: 'img/3.jpg',
        gradient: '#fddb92 0%, #d1fdff 100%'
    },
    {
        artist: '黯淡渐变',
        name: 'A great dribble shot',
        // image: 'img/3.jpg',
        gradient: '#ebc0fd 0%, #d9ded8 100%'
    },
    {
        artist: 'The Glyph',
        name: 'A great dribble shot',
        // image: 'img/3.jpg',
        gradient: '#fff1eb 0%, #ace0f9 100%'
    },
    {
        artist: 'The Glyph',
        name: 'A great dribble shot',
        // image: 'img/3.jpg',
        gradient: '#feada6 0%, #f5efef 100%'
    },
    {
        artist: 'The Glyph',
        name: 'A great dribble shot',
        // image: 'img/3.jpg',
        gradient: '#accbee 0%, #e7f0fd 100%'
    },
// {
    //     artist: '字体可能看不清',
    //     name: 'A great dribble shot',
    //     // image: 'img/3.jpg',
    //     gradient: '#e9defa 0%, #fbfcdb 100%'
    // },
    {
        artist: '浅抹茶绿',
        name: 'A great dribble shot',
        // image: 'img/3.jpg',
        gradient: '#c1dfc4 0%, #deecdd 100%'
    },
    {
        artist: '颜色太浅看不清字体',
        name: 'A great dribble shot',
        // image: 'img/3.jpg',
        gradient: '#f3e7e9 0%, #e3eeff 99%, #e3eeff 100%'
    },
    {
        artist: 'The Glyph',
        name: 'A great dribble shot',
        // image: 'img/3.jpg',
        gradient: '#9795f0 0%, #fbc8d4 100%'
    },
]

const widget = new PlayerWidget(document.querySelector('.c-player'), tracks)



console.clear()
//初始化音乐
var processtime = 0
var musicnum = 0
setTimeout(function () {
    document.getElementById('audio').src = './bgm/' + musicList[musicnum]
}, 0)
var songname = musicList[musicnum].split('-')[1].replace(".mp3","").split('[')[0]
var singer = musicList[musicnum].split('-')[0]
document.getElementById('singer').textContent=singer
document.getElementById('songname').textContent=songname
var oAudio = document.getElementById('audio');
let musicDom = document.getElementsByTagName('audio')[0];  // 获取AudioDom节点
            musicDom.load();//因为source标签不能直接更改路径，所以整个audio标签必须重新加载一次
            musicDom.oncanplay = function () {  
                console.log("音乐时长",musicDom.duration);//音乐总时长
                processtime = ~~Number(musicDom.duration*10)
                processtime+=50
                console.log(processtime)
                //处理时长
                var time = musicDom.duration;
                //分钟
                var minute = time / 60;
                var minutes = parseInt(minute);
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                //秒
                var second = time % 60;
                var seconds = Math.round(second);
                if (seconds < 10) {
                    seconds = "0" + seconds;
                }
                console.log('处理音乐时长',minutes+"："+seconds)
            }
// oAudio.addEventListener('ended',function(){
//     var btn = document.getElementById("c-player__ui__next");
//     btn.onclick = function(){
//         btn.click()
//     }
// })
    
// oAudio.addEventListener('ended',this.nextTrack())
//专辑图片旋转
var rotateval = 0 // 旋转角度
var Interval //定时器
//核心代码定时器
function rotate() {
Interval = setInterval(function () {
    var img = document.getElementById('img')
    var img1 = document.getElementById('img1')
    rotateval += 1
    img.style.transform = 'rotate(' + rotateval + 'deg)'
    img.style.transition = '0.1s linear'
    img1.style.transform = 'rotate(' + rotateval + 'deg)'
    img1.style.transition = '0.1s linear'
}, 100)
}
oAudio.addEventListener('ended',function(){
    var btn = document.getElementById("nextsong");
    btn.click();
})
