export type Response<T> = { status: number; data: T };
export type ErrorData = { error: string };

export type ApiResponse<T> = Response<T | ErrorData>

export type VideoDataRaw = {
    title: string,
    duration: number,
    description: string,
    tags: string[],
    views: number,
    author: string,
    authorLink: string,
    videoId: string,
    uploadDate: null,
    comments: null,
    stars: number,
    numRatings: number,
    age: string,
    dateFeaturedEpoch: number,
    dateFeatured: string,
    timestampFeatured: string,
    categories: string[],
    selectedBy: string,
    selectedByLink: string
    featureType?: string
}
