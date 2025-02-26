document.addEventListener('DOMContentLoaded', () => {
    particlesJS('particles-js', {
        particles: {
            number: { value: 100, density: { enable: true, value_area: 1200 } },
            color: { value: '#ffcc00' },
            shape: { type: 'circle' },
            opacity: { value: 0.7, random: true },
            size: { value: 5, random: true },
            line_linked: { enable: true, distance: 180, color: '#ffffff', opacity: 0.6, width: 1.5 },
            move: { enable: true, speed: 4, direction: 'none', random: true, straight: false, out_mode: 'out' }
        },
        interactivity: {
            events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } },
            modes: { repulse: { distance: 150 }, push: { particles_nb: 6 } }
        }
    });

    particlesJS('particles-js-ranking', {
        particles: { number: { value: 70 }, color: { value: '#ffcc00' } }
    });

    anime({
        targets: '.loader',
        opacity: 0,
        duration: 600,
        easing: 'easeOutQuad',
        complete: () => document.querySelector('.loader').style.display = 'none'
    });
});

anime({
    targets: '.hero-content',
    translateY: [-80, 0],
    opacity: [0, 1],
    scale: [0.95, 1],
    duration: 1600,
    easing: 'easeOutElastic(1, .4)'
});

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            anime({
                targets: entry.target.querySelector('h2'),
                translateY: [50, 0],
                opacity: [0, 1],
                duration: 1200,
                easing: 'easeOutExpo'
            });
            anime({
                targets: entry.target.querySelectorAll('.content-card, .ranking-item, .flashcard'),
                translateY: [80, 0],
                opacity: [0, 1],
                scale: [0.9, 1],
                duration: 1400,
                delay: anime.stagger(300),
                easing: 'easeOutExpo'
            });
        }
    });
}, { threshold: 0.4 });

document.querySelectorAll('.section').forEach(section => sectionObserver.observe(section));

const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeToggle.innerHTML = document.body.classList.contains('dark') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

let currentUser = null;
let uploadedVideos = [];
let badges = [];
let personalCourses = [];
let progress = 0;
let points = 0;
let level = 1;

const instruments = [
    { id: 1, title: 'Đàn Tranh', description: 'Kỹ thuật gảy đàn tranh', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/300/200?random=1' },
    { id: 2, title: 'Đàn Nguyệt', description: 'Học chơi đàn nguyệt cơ bản', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/300/200?random=2' },
    { id: 3, title: 'Sáo', description: 'Kỹ thuật thổi sáo', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/300/200?random=3' }
];

const martialArts = [
    { id: 4, title: 'Vovinam Cơ Bản', description: 'Bài quyền cơ bản', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/300/200?random=4' },
    { id: 5, title: 'Vovinam Nâng Cao', description: 'Kỹ thuật đấm đá', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/300/200?random=5' }
];

const challenges = [
    { id: 1, title: 'Chơi Đàn Tranh', description: 'Hoàn thành bài cơ bản', reward: 'Chứng chỉ', thumbnail: 'https://picsum.photos/300/200?random=6' },
    { id: 2, title: 'Vovinam 5 Động Tác', description: 'Thực hiện bài quyền', reward: 'Điểm thưởng', thumbnail: 'https://picsum.photos/300/200?random=7' }
];

let rankings = JSON.parse(localStorage.getItem('rankings')) || Array.from({ length: 10 }, (_, i) => ({
    name: `Sinh viên ${i + 1}`,
    points: 300 - i * 25,
    avatar: `https://picsum.photos/50?random=${i + 1}`
}));

const flashcards = {
    'sao': [
        { question: 'Sáo được làm từ chất liệu gì?', answer: 'Tre hoặc kim loại.' },
        { question: 'Sáo có bao nhiêu lỗ bấm?', answer: 'Thường có 6-7 lỗ.' },
        { question: 'Cách cầm sáo đúng là gì?', answer: 'Cầm ngang, tay trái trên, tay phải dưới.' },
        { question: 'Âm sắc của sáo như thế nào?', answer: 'Trong trẻo, cao vút.' },
        { question: 'Sáo thuộc loại nhạc cụ gì?', answer: 'Nhạc cụ hơi.' },
        { question: 'Kỹ thuật thổi sáo cơ bản?', answer: 'Kiểm soát hơi thở và bấm lỗ.' },
        { question: 'Sáo Việt Nam thường chơi ở thang âm nào?', answer: 'Thang âm 5 nốt (pentatonic).' },
        { question: 'Sáo được sử dụng trong dịp nào?', answer: 'Lễ hội, biểu diễn dân gian.' },
        { question: 'Ai là người nổi tiếng chơi sáo?', answer: 'Đình Thậm.' },
        { question: 'Sáo có mấy loại chính?', answer: 'Sáo ngang và sáo dọc.' },
        { question: 'Cách bảo quản sáo?', answer: 'Giữ khô, tránh ẩm mốc.' },
        { question: 'Sáo có thể chơi hòa tấu không?', answer: 'Có, với các nhạc cụ khác.' },
        { question: 'Âm vực của sáo là bao nhiêu?', answer: 'Khoảng 2 quãng tám.' },
        { question: 'Sáo thường dài bao nhiêu?', answer: 'Khoảng 50-60 cm.' },
        { question: 'Lỗ thổi của sáo nằm ở đâu?', answer: 'Gần đầu ống.' },
        { question: 'Sáo có thể chơi nhạc hiện đại không?', answer: 'Có, tùy kỹ thuật người chơi.' },
        { question: 'Kỹ thuật rung hơi trong sáo gọi là gì?', answer: 'Vibrato.' },
        { question: 'Sáo được phát minh từ khi nào?', answer: 'Hàng nghìn năm trước.' },
        { question: 'Sáo có xuất xứ từ đâu?', answer: 'Trung Quốc và Việt Nam.' },
        { question: 'Cách điều chỉnh âm thanh sáo?', answer: 'Thay đổi vị trí bấm lỗ.' },
        { question: 'Sáo có thể chơi solo không?', answer: 'Có.' },
        { question: 'Sáo thường được sơn màu gì?', answer: 'Màu tự nhiên của tre.' },
        { question: 'Sáo có mấy nốt cơ bản?', answer: '7 nốt (do, re, mi, fa, sol, la, si).' },
        { question: 'Kỹ thuật ngắt hơi trong sáo?', answer: 'Dùng lưỡi chặn luồng khí.' },
        { question: 'Sáo có thể chơi nhạc jazz không?', answer: 'Có, với kỹ thuật hiện đại.' },
        { question: 'Sáo cần bao lâu để học cơ bản?', answer: 'Khoảng 1-3 tháng.' },
        { question: 'Sáo có thể chơi cùng đàn tranh không?', answer: 'Có, rất hợp.' },
        { question: 'Sáo có dùng trong nhạc phim không?', answer: 'Có, tạo cảm xúc sâu lắng.' },
        { question: 'Sáo có mấy kích cỡ?', answer: 'Nhiều kích cỡ tùy loại.' },
        { question: 'Cách kiểm tra sáo tốt?', answer: 'Thổi thử, kiểm tra âm thanh.' },
        { question: 'Sáo có thể chơi nhạc dân ca không?', answer: 'Có, rất phổ biến.' },
        { question: 'Sáo có thể làm từ nhựa không?', answer: 'Có, nhưng ít phổ biến.' },
        { question: 'Sáo có bao nhiêu phím phụ?', answer: 'Không có phím phụ.' },
        { question: 'Sáo cần hơi thở mạnh không?', answer: 'Tùy bài nhạc.' },
        { question: 'Sáo có thể chơi nhạc cổ điển không?', answer: 'Có, với kỹ thuật cao.' },
        { question: 'Sáo thường được chơi ở đâu?', answer: 'Trong nhà hoặc ngoài trời.' },
        { question: 'Sáo có thể tự làm không?', answer: 'Có, từ tre đơn giản.' },
        { question: 'Sáo có bao nhiêu loại âm sắc?', answer: 'Tùy cách thổi.' },
        { question: 'Sáo có phù hợp với trẻ em không?', answer: 'Có, dễ học.' },
        { question: 'Sáo có thể chơi cùng guitar không?', answer: 'Có.' },
        { question: 'Sáo có cần bảo dưỡng không?', answer: 'Có, lau sạch sau khi chơi.' },
        { question: 'Sáo có thể chơi nhạc pop không?', answer: 'Có.' },
        { question: 'Sáo có bao nhiêu lỗ phụ?', answer: 'Thường không có.' },
        { question: 'Sáo có thể chơi nhạc truyền thống không?', answer: 'Có, rất phù hợp.' },
        { question: 'Sáo có mấy kiểu thổi?', answer: 'Thổi trực tiếp và rung hơi.' },
        { question: 'Sáo có thể chơi cùng trống không?', answer: 'Có.' },
        { question: 'Sáo có cần học nhạc lý không?', answer: 'Nên học để chơi tốt hơn.' },
        { question: 'Sáo có thể chơi nhạc buồn không?', answer: 'Có, rất cảm xúc.' },
        { question: 'Sáo thường nặng bao nhiêu?', answer: 'Khoảng 100-200g.' },
        { question: 'Sáo có thể chơi nhạc nhanh không?', answer: 'Có, tùy kỹ năng.' }
    ].sort(() => Math.random() - 0.5),
    'dan-tranh': [
        { question: 'Đàn tranh có bao nhiêu dây?', answer: 'Thường có 16-17 dây.' },
        { question: 'Kỹ thuật gảy đàn tranh cơ bản?', answer: 'Dùng móng gảy bằng ngón cái và trỏ.' },
        { question: 'Đàn tranh thuộc loại nhạc cụ gì?', answer: 'Nhạc cụ dây.' },
        { question: 'Đàn tranh có xuất xứ từ đâu?', answer: 'Trung Quốc, ViệtNam hóa.' },
        { question: 'Đàn tranh thường làm từ gỗ gì?', answer: 'Gỗ ngô đồng.' },
        { question: 'Âm sắc đàn tranh như thế nào?', answer: 'Mềm mại, réo rắt.' },
        { question: 'Cách lên dây đàn tranh?', answer: 'Theo thang âm pentatonic.' },
        { question: 'Đàn tranh có bao nhiêu phím?', answer: 'Không có phím.' },
        { question: 'Đàn tranh chơi solo được không?', answer: 'Có.' },
        { question: 'Đàn tranh thường dài bao nhiêu?', answer: 'Khoảng 110-120 cm.' },
        { question: 'Kỹ thuật rung dây đàn tranh?', answer: 'Nhấn dây bằng tay trái.' },
        { question: 'Đàn tranh có thể chơi nhạc hiện đại không?', answer: 'Có.' },
        { question: 'Đàn tranh thường dùng trong dịp nào?', answer: 'Lễ hội, biểu diễn.' },
        { question: 'Đàn tranh có bao nhiêu nhạn?', answer: '16-17 nhạn.' },
        { question: 'Đàn tranh có thể hòa tấu không?', answer: 'Có, với nhạc cụ khác.' },
        { question: 'Đàn tranh nặng bao nhiêu?', answer: 'Khoảng 2-3 kg.' },
        { question: 'Đàn tranh có cần móng gảy không?', answer: 'Có, để âm thanh vang.' },
        { question: 'Đàn tranh có thể chơi nhạc cổ điển không?', answer: 'Có.' },
        { question: 'Đàn tranh có bao nhiêu âm sắc?', answer: 'Tùy cách gảy.' },
        { question: 'Đàn tranh thường được sơn màu gì?', answer: 'Màu gỗ tự nhiên.' },
        { question: 'Đàn tranh có thể chơi nhạc pop không?', answer: 'Có.' },
        { question: 'Đàn tranh có cần học nhạc lý không?', answer: 'Nên học.' },
        { question: 'Đàn tranh có thể chơi cùng sáo không?', answer: 'Có, rất hợp.' },
        { question: 'Đàn tranh có bao nhiêu kiểu gảy?', answer: 'Nhiều kiểu như vê, nhấn.' },
        { question: 'Đàn tranh có thể tự làm không?', answer: 'Khó, cần kỹ thuật cao.' },
        { question: 'Đàn tranh phù hợp với ai?', answer: 'Mọi lứa tuổi.' },
        { question: 'Đàn tranh có cần bảo dưỡng không?', answer: 'Có, giữ khô ráo.' },
        { question: 'Đàn tranh có thể chơi nhạc jazz không?', answer: 'Có, với kỹ thuật cao.' },
        { question: 'Đàn tranh thường được chơi ở đâu?', answer: 'Trong nhà hoặc sân khấu.' },
        { question: 'Đàn tranh có dây phụ không?', answer: 'Không có dây phụ.' },
        { question: 'Đàn tranh có thể chơi nhạc buồn không?', answer: 'Có.' },
        { question: 'Đàn tranh thường cao bao nhiêu?', answer: 'Khoảng 20-25 cm.' },
        { question: 'Đàn tranh có thể chơi nhạc dân ca không?', answer: 'Có, rất phổ biến.' },
        { question: 'Đàn tranh có thể chơi cùng guitar không?', answer: 'Có.' },
        { question: 'Đàn tranh có bao nhiêu nốt?', answer: 'Tùy thang âm.' },
        { question: 'Đàn tranh có thể chơi nhạc nhanh không?', answer: 'Có.' },
        { question: 'Đàn tranh cần móng tay dài không?', answer: 'Không, dùng móng gảy.' },
        { question: 'Đàn tranh có thể chơi truyền thống không?', answer: 'Có.' },
        { question: 'Đàn tranh có bao nhiêu loại?', answer: 'Chủ yếu 1 loại.' },
        { question: 'Đàn tranh có thể chơi cùng trống không?', answer: 'Có.' },
        { question: 'Đàn tranh có thể chơi nhạc phim không?', answer: 'Có.' },
        { question: 'Đàn tranh cần bao lâu để học?', answer: '3-6 tháng cơ bản.' },
        { question: 'Đàn tranh có thể chơi nhạc cổ không?', answer: 'Có.' },
        { question: 'Đàn tranh có cần chỉnh dây thường xuyên không?', answer: 'Có, tùy môi trường.' },
        { question: 'Đàn tranh có thể chơi cùng đàn nguyệt không?', answer: 'Có.' },
        { question: 'Đàn tranh có thể chơi nhạc vui không?', answer: 'Có.' },
        { question: 'Đàn tranh thường được làm thủ công không?', answer: 'Có.' },
        { question: 'Đàn tranh có thể chơi nhạc chậm không?', answer: 'Có.' },
        { question: 'Đàn tranh có bao nhiêu âm vực?', answer: 'Khoảng 3 quãng tám.' }
    ].sort(() => Math.random() - 0.5),
    'dan-nguyet': [
        { question: 'Đàn nguyệt còn được gọi là gì?', answer: 'Đàn kìm.' },
        { question: 'Đàn nguyệt có bao nhiêu dây?', answer: '2 dây.' },
        { question: 'Cách lên dây đàn nguyệt?', answer: 'Dây thứ nhất: Sol, dây thứ hai: Ré.' },
        { question: 'Đàn nguyệt thuộc loại nhạc cụ gì?', answer: 'Nhạc cụ dây.' },
        { question: 'Đàn nguyệt có xuất xứ từ đâu?', answer: 'Việt Nam.' },
        { question: 'Đàn nguyệt làm từ gỗ gì?', answer: 'Gỗ mun hoặc gỗ trắc.' },
        { question: 'Âm sắc đàn nguyệt như thế nào?', answer: 'Sâu lắng, ấm.' },
        { question: 'Đàn nguyệt thường dài bao nhiêu?', answer: 'Khoảng 80-90 cm.' },
        { question: 'Kỹ thuật gảy đàn nguyệt?', answer: 'Dùng móng hoặc ngón tay.' },
        { question: 'Đàn nguyệt có thể chơi solo không?', answer: 'Có.' },
        { question: 'Đàn nguyệt dùng trong dịp nào?', answer: 'Biểu diễn dân ca.' },
        { question: 'Đàn nguyệt có bao nhiêu phím?', answer: 'Không có phím.' },
        { question: 'Đàn nguyệt chơi hòa tấu được không?', answer: 'Có.' },
        { question: 'Đàn nguyệt nặng bao nhiêu?', answer: 'Khoảng 1-2 kg.' },
        { question: 'Đàn nguyệt có thể chơi nhạc hiện đại không?', answer: 'Có.' },
        { question: 'Đàn nguyệt có bao nhiêu âm sắc?', answer: 'Tùy cách gảy.' },
        { question: 'Đàn nguyệt thường sơn màu gì?', answer: 'Màu gỗ tự nhiên.' },
        { question: 'Đàn nguyệt có thể chơi nhạc pop không?', answer: 'Có.' },
        { question: 'Đàn nguyệt cần học nhạc lý không?', answer: 'Nên học.' },
        { question: 'Đàn nguyệt có thể chơi cùng sáo không?', answer: 'Có.' },
        { question: 'Đàn nguyệt có bao nhiêu kiểu gảy?', answer: 'Gảy đơn, gảy đôi.' },
        { question: 'Đàn nguyệt có thể tự làm không?', answer: 'Khó, cần kỹ thuật.' },
        { question: 'Đàn nguyệt phù hợp với ai?', answer: 'Mọi lứa tuổi.' },
        { question: 'Đàn nguyệt có cần bảo dưỡng không?', answer: 'Có.' },
        { question: 'Đàn nguyệt có thể chơi nhạc jazz không?', answer: 'Có, với kỹ thuật cao.' },
        { question: 'Đàn nguyệt thường chơi ở đâu?', answer: 'Sân khấu hoặc trong nhà.' },
        { question: 'Đàn nguyệt có dây phụ không?', answer: 'Không.' },
        { question: 'Đàn nguyệt có thể chơi nhạc buồn không?', answer: 'Có.' },
        { question: 'Đàn nguyệt cao bao nhiêu?', answer: 'Khoảng 15-20 cm.' },
        { question: 'Đàn nguyệt có thể chơi dân ca không?', answer: 'Có, rất phổ biến.' },
        { question: 'Đàn nguyệt có thể chơi cùng guitar không?', answer: 'Có.' },
        { question: 'Đàn nguyệt có bao nhiêu nốt?', answer: 'Tùy thang âm.' },
        { question: 'Đàn nguyệt có thể chơi nhạc nhanh không?', answer: 'Có.' },
        { question: 'Đàn nguyệt cần móng gảy không?', answer: 'Không bắt buộc.' },
        { question: 'Đàn nguyệt có thể chơi truyền thống không?', answer: 'Có.' },
        { question: 'Đàn nguyệt có bao nhiêu loại?', answer: 'Chủ yếu 1 loại.' },
        { question: 'Đàn nguyệt có thể chơi cùng trống không?', answer: 'Có.' },
        { question: 'Đàn nguyệt có thể chơi nhạc phim không?', answer: 'Có.' },
        { question: 'Đàn nguyệt cần bao lâu để học?', answer: '3-6 tháng.' },
        { question: 'Đàn nguyệt có thể chơi nhạc cổ không?', answer: 'Có.' },
        { question: 'Đàn nguyệt có cần chỉnh dây thường xuyên không?', answer: 'Có.' },
        { question: 'Đàn nguyệt có thể chơi cùng đàn tranh không?', answer: 'Có.' },
        { question: 'Đàn nguyệt có thể chơi nhạc vui không?', answer: 'Có.' },
        { question: 'Đàn nguyệt thường làm thủ công không?', answer: 'Có.' },
        { question: 'Đàn nguyệt có thể chơi nhạc chậm không?', answer: 'Có.' },
        { question: 'Đàn nguyệt có bao nhiêu âm vực?', answer: 'Khoảng 2 quãng tám.' },
        { question: 'Đàn nguyệt có thể chơi nhạc dân tộc không?', answer: 'Có.' },
        { question: 'Đàn nguyệt có cần kỹ thuật cao không?', answer: 'Tùy bài nhạc.' },
        { question: 'Đàn nguyệt có thể chơi nhạc phương Tây không?', answer: 'Có.' }
    ].sort(() => Math.random() - 0.5),
    'vovinam': [
        { question: 'Vovinam là gì?', answer: 'Võ thuật truyền thống Việt Nam.' },
        { question: 'Người sáng lập Vovinam?', answer: 'Nguyễn Lộc.' },
        { question: 'Tư thế cơ bản của Vovinam?', answer: 'Ngựa tấn.' },
        { question: 'Vovinam được thành lập năm nào?', answer: '1938.' },
        { question: 'Màu sắc đồng phục Vovinam?', answer: 'Xanh dương.' },
        { question: 'Ý nghĩa của Vovinam?', answer: 'Võ đạo Việt Nam.' },
        { question: 'Vovinam có bao nhiêu đòn thế?', answer: 'Hàng trăm đòn.' },
        { question: 'Kỹ thuật đấm cơ bản trong Vovinam?', answer: 'Đấm thẳng.' },
        { question: 'Vovinam có bao nhiêu bài quyền?', answer: '10 bài quyền chính.' },
        { question: 'Vovinam có sử dụng vũ khí không?', answer: 'Có, như kiếm, côn.' },
        { question: 'Đòn đá cơ bản trong Vovinam?', answer: 'Đá ngang.' },
        { question: 'Vovinam có bao nhiêu cấp đai?', answer: '5 cấp chính.' },
        { question: 'Vovinam có thi đấu không?', answer: 'Có, đối kháng và biểu diễn.' },
        { question: 'Vovinam có dạy tự vệ không?', answer: 'Có.' },
        { question: 'Vovinam có phù hợp với trẻ em không?', answer: 'Có.' },
        { question: 'Vovinam có bao nhiêu thế khóa?', answer: 'Hơn 20 thế.' },
        { question: 'Vovinam có bài tập thể lực không?', answer: 'Có.' },
        { question: 'Vovinam có cần dụng cụ không?', answer: 'Không bắt buộc.' },
        { question: 'Vovinam có dạy tinh thần không?', answer: 'Có, võ đạo.' },
        { question: 'Vovinam có thể học ở đâu?', answer: 'Các võ đường.' },
        { question: 'Vovinam có bao nhiêu kỹ thuật bay?', answer: '7 kỹ thuật.' },
        { question: 'Vovinam có thể tự học không?', answer: 'Khó, cần hướng dẫn.' },
        { question: 'Vovinam có tổ chức thi không?', answer: 'Có, định kỳ.' },
        { question: 'Vovinam có bài tập khởi động không?', answer: 'Có.' },
        { question: 'Vovinam có dạy đòn chân không?', answer: 'Có, rất nhiều.' },
        { question: 'Vovinam có bao nhiêu thế vật?', answer: 'Hơn 10 thế.' },
        { question: 'Vovinam có cần sức mạnh không?', answer: 'Cần kỹ thuật hơn.' },
        { question: 'Vovinam có thể học online không?', answer: 'Có, phần lý thuyết.' },
        { question: 'Vovinam có bài quyền đôi không?', answer: 'Có.' },
        { question: 'Vovinam có dạy đòn tay không?', answer: 'Có.' },
        { question: 'Vovinam có bao nhiêu nguyên tắc?', answer: '10 nguyên tắc.' },
        { question: 'Vovinam có thể dùng để phòng thân không?', answer: 'Có.' },
        { question: 'Vovinam có bài tập nhóm không?', answer: 'Có.' },
        { question: 'Vovinam có dạy đòn gối không?', answer: 'Có.' },
        { question: 'Vovinam có cần sức bền không?', answer: 'Có.' },
        { question: 'Vovinam có bài quyền dài không?', answer: 'Có, tùy cấp.' },
        { question: 'Vovinam có dạy đòn cùi chỏ không?', answer: 'Có.' },
        { question: 'Vovinam có thể học trong bao lâu?', answer: '3-6 tháng cơ bản.' },
        { question: 'Vovinam có dạy kỹ thuật ngã không?', answer: 'Có.' },
        { question: 'Vovinam có bài tập đối kháng không?', answer: 'Có.' },
        { question: 'Vovinam có cần giày không?', answer: 'Không bắt buộc.' },
        { question: 'Vovinam có dạy đòn cổ tay không?', answer: 'Có.' },
        { question: 'Vovinam có bài quyền ngắn không?', answer: 'Có.' },
        { question: 'Vovinam có thể học cùng gia đình không?', answer: 'Có.' },
        { question: 'Vovinam có dạy đòn vai không?', answer: 'Có.' },
        { question: 'Vovinam có cần không gian rộng không?', answer: 'Nên có.' },
        { question: 'Vovinam có bài tập thiền không?', answer: 'Không bắt buộc.' },
        { question: 'Vovinam có dạy đòn đầu không?', answer: 'Không phổ biến.' },
        { question: 'Vovinam có phù hợp với người lớn tuổi không?', answer: 'Có, tùy sức khỏe.' }
    ].sort(() => Math.random() - 0.5)
};

function renderGrid(gridId, items, isPersonal = false) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = items.map(item => `
        <div class="content-card" draggable="${!isPersonal}" data-id="${item.id}">
            <div class="thumbnail" style="background-image: url(${item.thumbnail});"></div>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <div class="buttons">
                <button class="action-btn ripple-btn" data-type="learn" data-id="${item.id}">Học ngay</button>
                ${!isPersonal ? `<button class="action-btn add ripple-btn" data-type="add-personal" data-id="${item.id}">Thêm</button>` : ''}
            </div>
        </div>
    `).join('');
}

renderGrid('instrument-grid', instruments);
renderGrid('martial-grid', martialArts);
renderGrid('challenge-grid', challenges);
renderGrid('personal-courses-grid', personalCourses, true);

const droppable = document.getElementById('personal-courses-grid');
droppable.addEventListener('dragover', (e) => e.preventDefault());
droppable.addEventListener('drop', (e) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData('text/plain'));
    const lesson = [...instruments, ...martialArts].find(l => l.id === id);
    if (lesson && !personalCourses.some(pc => pc.id === id)) {
        personalCourses.push(lesson);
        renderGrid('personal-courses-grid', personalCourses, true);
        savePersonalCourses();
        showNotification('Đã thêm vào khóa học yêu thích!', 'success');
    }
});

document.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('content-card')) {
        e.dataTransfer.setData('text/plain', e.target.dataset.id);
    }
});

function renderFeedbackList() {
    const feedbackList = document.getElementById('feedback-list');
    feedbackList.innerHTML = uploadedVideos.map(video => `
        <div class="feedback-item">
            <p><strong>Email:</strong> ${video.email}</p>
            <p><strong>Ghi chú:</strong> ${video.note}</p>
            <video controls src="${video.url}" class="feedback-video" loading="lazy"></video>
            <textarea class="teacher-comment" placeholder="Nhận xét giảng viên..." data-id="${video.id}">${video.teacherComment || ''}</textarea>
            <button class="action-btn ripple-btn" onclick="submitTeacherComment(${video.id})">Gửi nhận xét</button>
        </div>
    `).join('');
}

function submitTeacherComment(videoId) {
    const comment = document.querySelector(`.teacher-comment[data-id="${videoId}"]`).value;
    const video = uploadedVideos.find(v => v.id === videoId);
    if (video && comment) {
        video.teacherComment = comment;
        localStorage.setItem('uploadedVideos', JSON.stringify(uploadedVideos));
        showNotification('Nhận xét đã được gửi!', 'success');
        renderFeedbackList();
    }
}

const searchInput = document.getElementById('search');
const suggestions = document.getElementById('search-suggestions');
const allItems = [...instruments, ...martialArts, ...challenges];

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

searchInput.addEventListener('input', debounce((e) => {
    const query = e.target.value.toLowerCase();
    const filteredInstruments = instruments.filter(i => i.title.toLowerCase().includes(query) || i.description.toLowerCase().includes(query));
    const filteredMartialArts = martialArts.filter(m => m.title.toLowerCase().includes(query) || m.description.toLowerCase().includes(query));
    renderGrid('instrument-grid', filteredInstruments);
    renderGrid('martial-grid', filteredMartialArts);

    suggestions.innerHTML = allItems
        .filter(item => item.title.toLowerCase().includes(query))
        .map(item => `<option value="${item.title}">`)
        .join('');
}, 300));

document.addEventListener('click', (e) => {
    const btn = e.target;
    if (btn.dataset.type === 'learn' && currentUser) {
        progress = Math.min(progress + 30, 100);
        points += 20;
        updateLevel();
        checkBadges();
        updateProgress();
        showNotification('Hoàn thành bài học! +20 điểm', 'success');
        updateProfile();
    } else if (btn.dataset.type === 'add-personal' && currentUser) {
        const lessonId = parseInt(btn.dataset.id);
        const lesson = [...instruments, ...martialArts].find(l => l.id === lessonId);
        if (lesson && !personalCourses.some(pc => pc.id === lessonId)) {
            personalCourses.push(lesson);
            renderGrid('personal-courses-grid', personalCourses, true);
            savePersonalCourses();
            showNotification('Đã thêm vào khóa học yêu thích!', 'success');
        }
    }
});

function updateProgress() {
    const circumference = 565.48;
    const offset = circumference - (progress / 100) * circumference;
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        anime({
            targets: progressFill,
            strokeDashoffset: [anime.setDashoffset, offset],
            duration: 1400,
            easing: 'easeOutExpo',
            begin: () => {
                anime({
                    targets: '.progress-circle',
                    scale: [1, 1.2],
                    rotate: [0, 25],
                    duration: 800,
                    easing: 'easeOutElastic(1, .4)',
                    direction: 'alternate'
                });
            }
        });
    }
    document.getElementById('progress-text').textContent = `${progress}%`;
    document.getElementById('points-text').textContent = `Điểm thưởng: ${points}`;
    document.getElementById('level-text').textContent = `Cấp độ: ${level}`;
    saveProgress();
}

function updateLevel() {
    level = Math.floor(points / 100) + 1;
    if (points % 100 === 0) {
        showNotification(`Chúc mừng! Bạn đã lên cấp ${level}!`, 'success');
    }
}

function checkBadges() {
    const badgeThresholds = [
        { points: 50, name: 'Beginner' },
        { points: 200, name: 'Advanced' },
        { points: 500, name: 'Master' }
    ];
    badgeThresholds.forEach(badge => {
        if (points >= badge.points && !badges.includes(badge.name)) {
            badges.push(badge.name);
            showNotification(`Chúc mừng! Bạn nhận được huy hiệu "${badge.name}"`, 'success');
        }
    });
    renderBadges();
}

function renderBadges() {
    const badgeList = document.getElementById('badge-list');
    badgeList.innerHTML = badges.map(badge => `
        <div class="badge">${badge}</div>
    `).join('');
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    anime({
        targets: notification,
        translateX: [80, 0],
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 1000,
        easing: 'easeOutExpo',
        complete: () => setTimeout(() => {
            anime({
                targets: notification,
                translateX: 80,
                opacity: 0,
                duration: 1000,
                easing: 'easeInExpo',
                complete: () => notification.style.display = 'none'
            });
        }, 4000)
    });
}

function resetPage() {
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.querySelector('.hero').scrollIntoView({ behavior: 'smooth' });
    anime({
        targets: '.hero',
        opacity: [0, 1],
        translateY: [40, 0],
        scale: [0.98, 1],
        duration: 1200,
        easing: 'easeOutExpo'
    });
}

function showLearningPage() {
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    const learningPage = document.getElementById('learning-page');
    learningPage.style.display = 'block';
    learningPage.scrollIntoView({ behavior: 'smooth' });
    anime({
        targets: '#learning-page .learning-section',
        opacity: [0, 1],
        translateY: [80, 0],
        scale: [0.95, 1],
        duration: 1400,
        delay: anime.stagger(400),
        easing: 'easeOutExpo'
    });
}

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.dataset.section;
        if (sectionId === 'explore') return showLearningPage();
        showSection(sectionId);
    });
});

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
        section.scrollIntoView({ behavior: 'smooth' });
        anime({
            targets: section,
            opacity: [0, 1],
            translateY: [40, 0],
            scale: [0.98, 1],
            duration: 1200,
            easing: 'easeOutExpo'
        });
        if (sectionId === 'teacher-dashboard') renderFeedbackList();
        if (sectionId === 'profile') updateProfile();
        if (sectionId === 'ranking') renderRanking();
        if (sectionId === 'flashcards') initFlashcards();
    }
}

const authModal = document.getElementById('auth-modal');
document.querySelector('.login-btn').addEventListener('click', () => openAuthModal('Đăng nhập'));
document.querySelector('.signup-btn').addEventListener('click', () => openAuthModal('Đăng ký'));

function openAuthModal(title) {
    authModal.style.display = 'flex';
    document.getElementById('modal-title').textContent = title;
    document.querySelector('.auth-submit').textContent = title;
    document.getElementById('toggle-link').textContent = title === 'Đăng nhập' ? 'Đăng ký' : 'Đăng nhập';
    anime({
        targets: '.modal-content',
        scale: [0, 1],
        opacity: [0, 1],
        translateY: [-80, 0],
        rotate: [5, 0],
        duration: 1200,
        easing: 'easeOutElastic(1, .4)'
    });
    anime({
        targets: '.auth-form input, .auth-submit, .toggle-auth, .social-login button',
        translateY: [40, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: anime.stagger(200),
        easing: 'easeOutExpo'
    });
}

authModal.querySelector('.close-modal').addEventListener('click', closeAuthModal);
document.getElementById('toggle-link').addEventListener('click', (e) => {
    e.preventDefault();
    openAuthModal(document.getElementById('modal-title').textContent === 'Đăng nhập' ? 'Đăng ký' : 'Đăng nhập');
});

function closeAuthModal() {
    anime({
        targets: '.modal-content',
        scale: [1, 0],
        opacity: [1, 0],
        translateY: [0, -80],
        rotate: [0, 5],
        duration: 800,
        easing: 'easeInExpo',
        complete: () => authModal.style.display = 'none'
    });
}

document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    showLoading();
    setTimeout(() => {
        if (email === 'student@fpt.edu.vn' && password === 'student123') {
            currentUser = { email, name: 'Nguyễn Văn A', role: 'student' };
            showNotification('Đăng nhập thành công!', 'success');
            closeAuthModal();
            updateProfile();
        } else if (email === 'teacher@fpt.edu.vn' && password === 'teacher123') {
            currentUser = { email, name: 'Giảng viên B', role: 'teacher' };
            showNotification('Đăng nhập thành công!', 'success');
            closeAuthModal();
            updateProfile();
        } else if (email && password) {
            currentUser = { email, name: 'Người dùng mới', role: 'student' };
            showNotification('Đăng ký thành công!', 'success');
            closeAuthModal();
            updateProfile();
        } else {
            showNotification('Thông tin không hợp lệ!', 'error');
        }
        hideLoading();
    }, 1000);
});

const videoUploadModal = document.getElementById('video-upload-modal');
document.getElementById('upload-video-btn')?.addEventListener('click', () => {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để gửi video!', 'error');
        return;
    }
    videoUploadModal.style.display = 'flex';
    anime({
        targets: '.modal-content',
        scale: [0, 1],
        opacity: [0, 1],
        translateY: [-80, 0],
        duration: 1000,
        easing: 'easeOutElastic(1, .4)'
    });
});

videoUploadModal.querySelector('.close-modal').addEventListener('click', () => {
    anime({
        targets: '.modal-content',
        scale: [1, 0],
        opacity: [1, 0],
        translateY: [0, -80],
        duration: 800,
        easing: 'easeInExpo',
        complete: () => videoUploadModal.style.display = 'none'
    });
});

document.getElementById('video-upload-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const file = document.getElementById('video-file').files[0];
    const note = document.getElementById('video-note').value;
    if (file && currentUser) {
        const videoId = Date.now();
        const videoUrl = URL.createObjectURL(file);
        uploadedVideos.push({ id: videoId, email: currentUser.email, note, url: videoUrl, teacherComment: '' });
        localStorage.setItem('uploadedVideos', JSON.stringify(uploadedVideos));
        showNotification('Video đã được gửi thành công!', 'success');
        videoUploadModal.style.display = 'none';
        if (currentUser.role === 'teacher') renderFeedbackList();
    }
});

let currentRankingIndex = 0;
function renderRanking() {
    const rankingList = document.getElementById('ranking-list');
    const visibleRankings = rankings.slice(currentRankingIndex, currentRankingIndex + 3);
    rankingList.innerHTML = visibleRankings.map((user, i) => `
        <div class="ranking-item ${i + currentRankingIndex < 3 ? 'top-' + (i + currentRankingIndex + 1) : ''}">
            <div class="rank">${i + currentRankingIndex + 1}</div>
            <img src="${user.avatar}" alt="${user.name}" class="rank-avatar" loading="lazy">
            <span>${user.name}</span>
            <span class="points">${user.points} điểm</span>
        </div>
    `).join('');
    anime({
        targets: '.ranking-item',
        translateX: [-80, 0],
        opacity: [0, 1],
        duration: 1200,
        delay: anime.stagger(200),
        easing: 'easeOutExpo'
    });
    document.querySelector('.scroll-down-btn').style.display = currentRankingIndex + 3 < rankings.length ? 'block' : 'none';
    document.querySelector('.scroll-up-btn').style.display = currentRankingIndex > 0 ? 'block' : 'none';
}

document.querySelector('.scroll-down-btn')?.addEventListener('click', () => {
    if (currentRankingIndex + 3 < rankings.length) {
        currentRankingIndex += 3;
        renderRanking();
    }
});

document.querySelector('.scroll-up-btn')?.addEventListener('click', () => {
    if (currentRankingIndex > 0) {
        currentRankingIndex -= 3;
        renderRanking();
    }
});

function updateProfile() {
    if (currentUser) {
        document.getElementById('profile-name').textContent = currentUser.name;
        document.getElementById('profile-email').textContent = currentUser.email;
        document.getElementById('points-text').textContent = `Điểm thưởng: ${points}`;
        document.getElementById('level-text').textContent = `Cấp độ: ${level}`;
        document.getElementById('upload-video-btn').style.display = currentUser.role === 'student' ? 'block' : 'none';
        updateProgress();
        renderBadges();
    }
}

function showLoading() {
    document.querySelector('.loader').style.display = 'flex';
    anime({ targets: '.loader', opacity: [0, 1], scale: [0.8, 1], duration: 500, easing: 'easeOutExpo' });
}

function hideLoading() {
    anime({
        targets: '.loader',
        opacity: 0,
        scale: 0.8,
        duration: 500,
        easing: 'easeInExpo',
        complete: () => document.querySelector('.loader').style.display = 'none'
    });
}

function showChatbotLoading() {
    document.getElementById('chatbot-loading').style.display = 'flex';
    anime({ targets: '#chatbot-loading', opacity: [0, 1], duration: 500, easing: 'easeOutExpo' });
}

function hideChatbotLoading() {
    anime({
        targets: '#chatbot-loading',
        opacity: 0,
        duration: 500,
        easing: 'easeInExpo',
        complete: () => document.getElementById('chatbot-loading').style.display = 'none'
    });
}

function saveProgress() {
    localStorage.setItem('progress', progress);
    localStorage.setItem('points', points);
    localStorage.setItem('level', level);
    localStorage.setItem('badges', JSON.stringify(badges));
    localStorage.setItem('rankings', JSON.stringify(rankings));
}

function savePersonalCourses() {
    localStorage.setItem('personalCourses', JSON.stringify(personalCourses));
}

function loadData() {
    progress = parseInt(localStorage.getItem('progress')) || 0;
    points = parseInt(localStorage.getItem('points')) || 0;
    level = parseInt(localStorage.getItem('level')) || 1;
    personalCourses = JSON.parse(localStorage.getItem('personalCourses')) || [];
    uploadedVideos = JSON.parse(localStorage.getItem('uploadedVideos')) || [];
    badges = JSON.parse(localStorage.getItem('badges')) || [];
    rankings = JSON.parse(localStorage.getItem('rankings')) || rankings;
    renderGrid('personal-courses-grid', personalCourses, true);
    updateProfile();
}

loadData();

const chatbot = document.getElementById('chatbot');
const chatbotToggle = document.getElementById('chatbot-toggle');

chatbotToggle.addEventListener('click', () => {
    if (chatbot.style.display === 'none' || chatbot.style.display === '') {
        chatbot.style.display = 'flex';
        chatbotToggle.style.display = 'none';
        anime({
            targets: '.chatbot',
            translateX: [140, 0],
            opacity: [0, 1],
            scale: [0.95, 1],
            duration: 1000,
            easing: 'easeOutElastic(1, .4)'
        });
    }
});

chatbot.querySelector('.chatbot-close').addEventListener('click', () => {
    anime({
        targets: '.chatbot',
        translateX: [0, 140],
        opacity: [1, 0],
        scale: [1, 0.95],
        duration: 800,
        easing: 'easeInExpo',
        complete: () => {
            chatbot.style.display = 'none';
            chatbotToggle.style.display = 'block';
        }
    });
});

chatbot.addEventListener('mouseover', () => {
    document.getElementById('predefined-questions').classList.remove('hidden-questions');
    anime({
        targets: '#predefined-questions',
        opacity: [0, 1],
        translateX: [-40, 0],
        duration: 500,
        easing: 'easeOutExpo'
    });
});

chatbot.addEventListener('mouseout', () => {
    document.getElementById('predefined-questions').classList.add('hidden-questions');
    anime({
        targets: '#predefined-questions',
        opacity: [1, 0],
        translateX: [0, -40],
        duration: 500,
        easing: 'easeInExpo'
    });
});

document.getElementById('send-msg').addEventListener('click', sendChatMessage);
document.getElementById('chat-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
});
document.getElementById('predefined-questions').addEventListener('change', (e) => {
    if (e.target.value) {
        document.getElementById('chat-input').value = e.target.value;
        sendChatMessage();
        e.target.value = '';
    }
});

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.textContent = message;
    document.querySelector('.chatbot-body').appendChild(userMsg);
    anime({ targets: userMsg, translateY: [30, 0], opacity: [0, 1], duration: 600, easing: 'easeOutExpo' });

    input.value = '';
    showChatbotLoading();

    const predefinedReplies = {
        'làm sao để chơi đàn tranh?': 'Để chơi đàn tranh, bạn cần điều chỉnh dây đúng cao độ, sau đó tập gảy từng nốt cơ bản bằng cách dùng ngón tay cái và ngón trỏ.',
        'các bước tập vovinam cơ bản?': 'Bắt đầu với tư thế đứng cơ bản (ngựa tấn), sau đó học các động tác quyền như đấm thẳng, đá ngang và khóa tay.',
        'làm thế nào để thổi sáo?': 'Học cách kiểm soát hơi thở đều đặn, đặt môi đúng vị trí lỗ thổi và luyện tập bấm lỗ để tạo nốt.'
    };

    let reply;
    if (predefinedReplies[message.toLowerCase()]) {
        reply = predefinedReplies[message.toLowerCase()];
        setTimeout(() => sendBotReply(reply), 800);
    } else {
        reply = 'Tôi là trợ lý FPT. Tôi có thể giúp bạn với các câu hỏi về nhạc cụ dân tộc hoặc Vovinam. Hãy thử hỏi cụ thể hơn nhé!';
        setTimeout(() => sendBotReply(reply), 800);
    }
}

function sendBotReply(reply) {
    const botMsg = document.createElement('div');
    botMsg.className = 'message bot';
    botMsg.textContent = reply;
    document.querySelector('.chatbot-body').appendChild(botMsg);
    anime({ targets: botMsg, translateY: [30, 0], opacity: [0, 1], duration: 600, easing: 'easeOutExpo' });
    hideChatbotLoading();
    document.querySelector('.chatbot-body').scrollTop = document.querySelector('.chatbot-body').scrollHeight;
}

const hamburger = document.querySelector('.hamburger');
hamburger.addEventListener('click', () => {
    const nav = document.querySelector('.nav-menu');
    nav.classList.toggle('active');
    anime({
        targets: '.nav-menu.active li',
        translateX: [-60, 0],
        opacity: [0, 1],
        duration: 800,
        delay: anime.stagger(150),
        easing: 'easeOutExpo'
    });
});

// Flashcard Logic
let currentCardIndex = 0;
let currentCategory = 'sao';

//function initFlashcards() {
  //  if (!currentUser) {
    //    showNotification('Vui lòng đăng nhập để ôn tập flashcard!', 'error');
      //  document.getElementById('flashcards').style.display = 'none';
        //openAuthModal('Đăng nhập');
        //return;
    //}

    const flashcard = document.getElementById('flashcard');
    const flashcardFront = document.querySelector('.flashcard-front');
    const flashcardBack = document.querySelector('.flashcard-back');
    const flashcardProgress = document.getElementById('flashcard-progress');
    const categorySelect = document.getElementById('flashcard-category');
    const testModal = document.getElementById('flashcard-test-modal');
    const testContent = document.getElementById('flashcard-test-content');

    function updateCard() {
        const cards = flashcards[currentCategory];
        if (cards.length === 0) return;
        flashcardFront.textContent = cards[currentCardIndex].question;
        flashcardBack.textContent = cards[currentCardIndex].answer; // Hiển thị đáp án ở mặt sau
        flashcardProgress.textContent = `${currentCardIndex + 1}/${cards.length}`;
        flashcard.classList.remove('flipped'); // Reset về mặt trước khi chuyển thẻ
    }

    categorySelect.addEventListener('change', (e) => {
        currentCategory = e.target.value;
        currentCardIndex = 0;
        updateCard();
    });

    document.getElementById('prev-card').addEventListener('click', () => {
        const cards = flashcards[currentCategory];
        if (currentCardIndex > 0) {
            currentCardIndex--;
            updateCard();
        }
    });

    document.getElementById('next-card').addEventListener('click', () => {
        const cards = flashcards[currentCategory];
        if (currentCardIndex < cards.length - 1) {
            currentCardIndex++;
            updateCard();
        }
    });

    // Khi nhấn nút "Đáp án", lật thẻ để hiển thị đáp án
    document.getElementById('show-answer').addEventListener('click', () => {
        flashcard.classList.toggle('flipped');
    });

    testModal.querySelector('.close-modal').addEventListener('click', () => {
        anime({
            targets: '.modal-content',
            scale: [1, 0],
            opacity: [1, 0],
            translateY: [0, -80],
            duration: 800,
            easing: 'easeInExpo',
            complete: () => testModal.style.display = 'none'
        });
    });

    document.getElementById('submit-test').addEventListener('click', () => {
        const inputs = testContent.querySelectorAll('.flashcard-test-input');
        let score = 0;

        inputs.forEach(input => {
            const userAnswer = input.value.toLowerCase().trim();
            const correctAnswer = input.dataset.answer.toLowerCase().trim();
            if (userAnswer === correctAnswer) {
                score += 10;
            }
        });

        points += score;
        updateRanking();
        updateLevel();
        checkBadges();
        updateProgress();
        showNotification(`Bạn đã hoàn thành bài kiểm tra! +${score} điểm`, 'success');
        updateProfile();

        anime({
            targets: '.modal-content',
            scale: [1, 0],
            opacity: [1, 0],
            translateY: [0, -80],
            duration: 800,
            easing: 'easeInExpo',
            complete: () => testModal.style.display = 'none'
        });
    });

    updateCard();
//}

function updateRanking() {
    if (currentUser) {
        const userRank = rankings.find(r => r.name === currentUser.name);
        if (userRank) {
            userRank.points = points;
        } else {
            rankings.push({ name: currentUser.name, points, avatar: 'https://picsum.photos/50' });
        }
        rankings.sort((a, b) => b.points - a.points);
        rankings = rankings.slice(0, 10);
        localStorage.setItem('rankings', JSON.stringify(rankings));
        renderRanking();
    }
}