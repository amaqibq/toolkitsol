import { FilePreview } from './FilePreview'

interface ImageCardProps {
  image: {
    id: string
    preview: string
    name: string
    originalFormat: string
    size: string
  }
  onRemove: (id: string) => void
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, onRemove }) => {
  return (
    <FilePreview
      image={image}
      onRemove={() => onRemove(image.id)}
    />
  )
}