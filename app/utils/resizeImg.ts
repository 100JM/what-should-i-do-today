interface ResizedFileInterface {
    file: File;
    width: number;
    height: number;
}

export const resizeImg = (file: File, id: string, quality = 0.7): Promise<ResizedFileInterface> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        const [maxHeight, maxWidth] = [1200, 1200];

        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // 종횡비를 유지하면서 크기를 조정
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                // 이미지 스무딩을 위한 설정
                if (ctx) {
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
    
                    ctx.drawImage(img, 0, 0, width, height);
                }

                // 압축 적용
                canvas.toBlob((blob) => {
                    if (blob) {
                        const resizedFile = {
                            file: new File([blob], id, { type: blob.type }),
                            width: img.width,
                            height: img.height,
                        };
                        resolve(resizedFile);
                    }
                }, 'image/jpeg', quality);
            };

            img.src = event.target?.result as string;
        };

        reader.readAsDataURL(file);

    });
};