import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check environment variables
    const hasMongoUri = !!process.env.MONGODB_URI;
    const hasJwtSecret = !!process.env.JWT_SECRET;
    
    // Parse the MongoDB URI to check its structure
    let uriInfo = null;
    if (process.env.MONGODB_URI) {
      try {
        const uri = process.env.MONGODB_URI;
        const parts = uri.split('@');
        if (parts.length > 1) {
          const protocolAndUser = parts[0];
          const userParts = protocolAndUser.split('://');
          if (userParts.length > 1) {
            const credentials = userParts[1];
            const [username, password] = credentials.split(':');
            
            uriInfo = {
              hasProtocol: userParts[0].length > 0,
              username: username ? `${username.substring(0, 3)}...` : 'missing',
              hasPassword: !!password,
              host: parts[1].split('/')[0],
              database: parts[1].split('/')[1]?.split('?')[0] || 'not specified'
            };
          }
        }
      } catch (parseError) {
        uriInfo = { error: 'Failed to parse URI' };
      }
    }
    
    return res.status(200).json({ 
      hasMongoUri,
      hasJwtSecret,
      uriInfo,
      message: "Environment variables check completed"
    });
  } catch (error: any) {
    console.error("Credentials check failed:", error);
    return res.status(500).json({ 
      message: "Credentials check failed", 
      error: error.message
    });
  }
}