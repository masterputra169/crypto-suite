import os

def generate_tree(startpath, ignore_dirs=None):
    if ignore_dirs is None:
        ignore_dirs = []

    for root, dirs, files in os.walk(startpath):
        # Filter folder yang ingin diabaikan (agar tidak masuk ke loop)
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        
        level = root.replace(startpath, '').count(os.sep)
        indent = ' ' * 4 * (level)
        
        # Print nama folder saat ini
        print(f"{indent}{os.path.basename(root)}/")
        
        # Print semua file dalam folder tersebut
        subindent = ' ' * 4 * (level + 1)
        for f in files:
            print(f"{subindent}{f}")

if __name__ == "__main__":
    # Ganti '.' dengan path spesifik jika script dijalankan dari luar folder
    path_proyek = '.' 
    
    # Daftar folder yang BIKIN SEMAK (Sangat penting untuk project React/Web)
    folder_diabaikan = ['.git', 'node_modules', '__pycache__', '.vscode', 'dist', 'build']
    
    print(f"Struktur Project (Mengabaikan: {', '.join(folder_diabaikan)}):\n")
    print("="*40)
    generate_tree(path_proyek, folder_diabaikan)
    print("="*40)