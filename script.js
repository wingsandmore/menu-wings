document.addEventListener('DOMContentLoaded', () => {

    const stage = document.getElementById('menuStage');
    const image = document.getElementById('menuImage');

    let scale = 1;
    let startDistance = 0;
    let startScale = 1;
    let lastX = 0;
    let lastY = 0;
    let startX = 0;
    let startY = 0;
    let isPanning = false;

    function getDistance(t1, t2) {
        const dx = t2.clientX - t1.clientX;
        const dy = t2.clientY - t1.clientY;
        return Math.hypot(dx, dy);
    }

    function applyTransform() {
        image.style.transform = `translate(${lastX}px, ${lastY}px) scale(${scale})`;
    }

    stage.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            startDistance = getDistance(e.touches[0], e.touches[1]);
            startScale = scale;
            e.preventDefault();
        } else if (e.touches.length === 1 && scale > 1) {
            isPanning = true;
            startX = e.touches[0].clientX - lastX;
            startY = e.touches[0].clientY - lastY;
        }
    }, { passive: false });

    stage.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const distance = getDistance(e.touches[0], e.touches[1]);
            scale = Math.min(Math.max(startScale * (distance / startDistance), 1), 3);
            applyTransform();
        } else if (e.touches.length === 1 && isPanning && scale > 1) {
            e.preventDefault();
            lastX = e.touches[0].clientX - startX;
            lastY = e.touches[0].clientY - startY;
            applyTransform();
        }
    }, { passive: false });

    stage.addEventListener('touchend', () => {
        if (scale === 1) {
            lastX = 0;
            lastY = 0;
            applyTransform();
        }
        isPanning = false;
    });

    /* ===== MODAL ===== */

    const modal = document.getElementById('confirm-modal');
    const btnCancel = document.getElementById('btn-cancel');
    const btnConfirm = document.getElementById('btn-confirm');
    const socialName = document.getElementById('social-name');
    const modalIcon = document.getElementById('modal-social-icon');

    const socialData = {
        fb: { name: 'Facebook', color: '#1877F2', icon: 'bxl-facebook' },
        ig: { name: 'Instagram', color: '#E1306C', icon: 'bxl-instagram' },
        wa: { name: 'WhatsApp', color: '#25D366', icon: 'bxl-whatsapp' }
    };

    document.querySelectorAll('.fab').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            const type = this.classList.contains('fb') ? 'fb' :
                         this.classList.contains('ig') ? 'ig' : 'wa';

            const data = socialData[type];

            socialName.innerText = data.name;
            modalIcon.className = `bx ${data.icon}`;
            modalIcon.style.color = data.color;

            btnConfirm.href = this.href;
            btnConfirm.style.backgroundColor = data.color;

            modal.classList.add('active');
        });
    });

    btnCancel.addEventListener('click', () => modal.classList.remove('active'));
    btnConfirm.addEventListener('click', () => modal.classList.remove('active'));
});